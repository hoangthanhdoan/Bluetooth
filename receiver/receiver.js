class BLEReceiver {
    constructor() {
        this.isScanning = false;
        this.scan = null;
        this.initializeElements();
        this.initializeEventListeners();
        this.checkBluetoothSupport();
    }

    initializeElements() {
        this.startScanButton = document.getElementById('startScanButton');
        this.stopScanButton = document.getElementById('stopScanButton');
        this.statusDiv = document.getElementById('status');
        this.messagesDiv = document.getElementById('messages');
    }

    async checkBluetoothSupport() {
        if (!navigator.bluetooth) {
            this.statusDiv.textContent = 'Web Bluetooth API is not supported in this browser. Please use Chrome 79+ with experimental features enabled.';
            this.startScanButton.disabled = true;
            return false;
        }
        return true;
    }

    initializeEventListeners() {
        this.startScanButton.addEventListener('click', () => this.startScanning());
        this.stopScanButton.addEventListener('click', () => this.stopScanning());
    }

    updateButtons() {
        this.startScanButton.disabled = this.isScanning;
        this.stopScanButton.disabled = !this.isScanning;
    }

    async startScanning() {
        if (!await this.checkBluetoothSupport()) return;

        try {
            this.watchAdvertisements();

        } catch (error) {
            console.error('Error starting scan:', error);
            this.statusDiv.textContent = `Error: ${error.message}`;
            this.isScanning = false;
            this.updateButtons();
        }
    }

    logDataView(labelOfDataSource, key, valueDataView) {
        const hexString = [...new Uint8Array(valueDataView.buffer)].map(b => {
            return b.toString(16).padStart(2, '0');
        }).join(' ');
        const textDecoder = new TextDecoder('ascii');
        const asciiString = textDecoder.decode(valueDataView.buffer);
        return {
            hex: hexString,
            ascii: asciiString
        };
    }

    async watchAdvertisements() {
        if (!await this.checkBluetoothSupport()) return;

        try {
            this.statusDiv.textContent = 'Requesting any Bluetooth device...';
            const options = {
                acceptAllAdvertisements: true
            };

            console.log('vào đây nha');

            this.scan = await navigator.bluetooth.requestLEScan(options);
            console.log('this.scan', this.scan);
            this.isScanning = true;
            this.updateButtons();
            this.statusDiv.textContent = 'Watching advertisements...';

            navigator.bluetooth.addEventListener('advertisementreceived', (event) => {
                console.log('advertisementreceived', event);
                this.handleAdvertisement(event);
            });
            this.scan.addEventListener('advertisementreceived', (event) => {
                console.log('advertisementreceived', event);
                this.handleAdvertisement(event);
            });

            console.log('vào đây nha 2');

        } catch (error) {
            console.error('Error watching advertisements:', error);
            this.statusDiv.textContent = `Error: ${error.message}`;
            this.isScanning = false;
            this.updateButtons();
        }
    }

    handleAdvertisement(event) {
        try {
            // Log device information
            const deviceInfo = [
                `Device Name: ${event.device.name || 'Unknown Device'}`,
                `Device ID: ${event.device.id}`,
                `RSSI: ${event.rssi}`,
                `TX Power: ${event.txPower}`,
                `UUIDs: ${event.uuids || 'None'}`
            ];

            // Process manufacturer data
            if (event.manufacturerData) {
                event.manufacturerData.forEach((valueDataView, key) => {
                    const data = this.logDataView('Manufacturer', key, valueDataView);
                    deviceInfo.push(
                        `Manufacturer Data (${key}):`,
                        `  Hex: ${data.hex}`,
                        `  ASCII: ${data.ascii}`
                    );
                });
            }

            // Process service data
            if (event.serviceData) {
                event.serviceData.forEach((valueDataView, key) => {
                    const data = this.logDataView('Service', key, valueDataView);
                    deviceInfo.push(
                        `Service Data (${key}):`,
                        `  Hex: ${data.hex}`,
                        `  ASCII: ${data.ascii}`
                    );
                });
            }

            this.addMessage(deviceInfo.join('\n'));

        } catch (error) {
            console.error('Error handling advertisement:', error);
            this.addMessage(`Error processing advertisement: ${error.message}`);
        }
    }

    stopScanning() {
        try {
            if (this.scan && this.scan.active) {
                this.scan.stop();
                navigator.bluetooth.removeEventListener('advertisementreceived', this.handleAdvertisement);
            }
            this.isScanning = false;
            this.updateButtons();
            this.statusDiv.textContent = 'Scanning stopped';
        } catch (error) {
            console.error('Error stopping scan:', error);
            this.statusDiv.textContent = `Error: ${error.message}`;
        }
    }

    addMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.textContent = message;
        this.messagesDiv.appendChild(messageElement);
        this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
    }
}

// Initialize the BLE receiver when the page loads
window.addEventListener('load', () => {
    const receiver = new BLEReceiver();
    window.abc = () => receiver.watchAdvertisements();
}); 