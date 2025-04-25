class BLESender {
    constructor() {
        this.isBroadcasting = false;
        this.scan = null;
        this.initializeElements();
        this.initializeEventListeners();
        this.checkBluetoothSupport();
    }

    initializeElements() {
        this.startBroadcastButton = document.getElementById('startBroadcastButton');
        this.stopBroadcastButton = document.getElementById('stopBroadcastButton');
        this.messageInput = document.getElementById('messageInput');
        this.statusDiv = document.getElementById('status');
        this.broadcastStatus = document.getElementById('broadcastStatus');
        this.currentMessage = document.getElementById('currentMessage');
    }

    async checkBluetoothSupport() {
        if (!navigator.bluetooth) {
            this.statusDiv.textContent = 'Web Bluetooth API is not supported in this browser. Please use Chrome 79+ with experimental features enabled.';
            this.startBroadcastButton.disabled = true;
            return false;
        }
        return true;
    }

    initializeEventListeners() {
        this.startBroadcastButton.addEventListener('click', () => this.startBroadcasting());
        this.stopBroadcastButton.addEventListener('click', () => this.stopBroadcasting());
        this.messageInput.addEventListener('input', () => this.updateButtons());
    }

    updateButtons() {
        const hasMessage = this.messageInput.value.trim() !== '';
        this.startBroadcastButton.disabled = !hasMessage || this.isBroadcasting;
        this.stopBroadcastButton.disabled = !this.isBroadcasting;
    }

    async startBroadcasting() {
        if (!await this.checkBluetoothSupport()) return;

        try {
            this.statusDiv.textContent = 'Starting broadcast...';
            this.isBroadcasting = true;
            this.updateButtons();
            this.broadcastStatus.textContent = 'Broadcasting';
            this.currentMessage.textContent = this.messageInput.value.trim();

            // Create advertising data
            const message = this.messageInput.value.trim();
            const encoder = new TextEncoder();
            const data = encoder.encode(message);

            // Create manufacturer data
            const manufacturerId = 0x004C; // Apple's manufacturer ID
            const manufacturerData = new Uint8Array([0x02, 0x15, ...data]);

            // Start scanning with only acceptAllAdvertisements
            const options = {
                acceptAllAdvertisements: true
            };

            // Start broadcasting
            this.scan = await navigator.bluetooth.requestLEScan(options);
            
            // Listen for advertisements to confirm our broadcast
            navigator.bluetooth.addEventListener('advertisementreceived', (event) => {
                console.log('Advertisement received:', event);
                // Log only if this is our own advertisement
                if (event.manufacturerData && event.manufacturerData.get(manufacturerId)) {
                    console.log('Our broadcast was received!');
                }
            });

            // Log broadcast status
            console.log('Broadcasting started with:');
            console.log(' acceptAllAdvertisements:', this.scan.acceptAllAdvertisements);
            console.log(' active:', this.scan.active);

            this.statusDiv.textContent = 'Broadcasting started!';

            // Auto-stop after 10 minutes to save battery
            setTimeout(() => {
                if (this.isBroadcasting) {
                    this.stopBroadcasting();
                }
            }, 600000);

        } catch (error) {
            console.error('Error starting broadcast:', error);
            this.statusDiv.textContent = `Error: ${error.message}`;
            this.isBroadcasting = false;
            this.updateButtons();
        }
    }

    stopBroadcasting() {
        try {
            if (this.scan && this.scan.active) {
                this.scan.stop();
            }
            this.isBroadcasting = false;
            this.updateButtons();
            this.broadcastStatus.textContent = 'Not Broadcasting';
            this.statusDiv.textContent = 'Broadcasting stopped';
        } catch (error) {
            console.error('Error stopping broadcast:', error);
            this.statusDiv.textContent = `Error: ${error.message}`;
        }
    }
}

// Initialize the BLE sender when the page loads
window.addEventListener('load', () => {
    new BLESender();
}); 