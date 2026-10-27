import { useState, useEffect, useRef } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonSpinner,
  IonAlert,
  IonAvatar,
  IonBackButton,
  IonButtons,
  IonItem,
  IonInput,
} from '@ionic/react';
import { scanOutline, arrowBackOutline, flashOutline, flashOffOutline } from 'ionicons/icons';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { InventoryItem } from '../types';
import { getInventoryItemByQR, getStatusColor } from '../data/inventory';
import { useNavigate } from 'react-router-dom';

const Scanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [scannedItem, setScannedItem] = useState<InventoryItem | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [flashOn, setFlashOn] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    setError('');
    setScannedItem(null);
    setScanning(true);

    try {
      const html5Qrcode = new Html5Qrcode('qr-reader', {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.EAN_13,
        ],
        verbose: false,
      });

      scannerRef.current = html5Qrcode;

      await html5Qrcode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleScanResult(decodedText);
        },
        () => {
          // QR scan error callback - ignore
        }
      );
    } catch (err) {
      console.error('Scanner error:', err);
      setError('Unable to access camera. Please ensure camera permissions are granted.');
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (e) {
        // ignore
      }
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const handleScanResult = async (qrCode: string) => {
    stopScanner();
    setLoading(true);

    try {
      const item = await getInventoryItemByQR(qrCode);
      if (item) {
        setScannedItem(item);
      } else {
        setError(`No inventory item found for code: ${qrCode}`);
        setShowAlert(true);
      }
    } catch (err) {
      setError('Error looking up item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = async () => {
    if (!manualCode.trim()) return;
    await handleScanResult(manualCode.trim());
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
    // Flash toggle would be implemented with camera capabilities
    // This is a UI placeholder for the feature
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" text="Dashboard" />
          </IonButtons>
          <IonTitle>QR Scanner</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {!scanning && !scannedItem && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-48 h-48 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
              <IonIcon icon={scanOutline} style={{ fontSize: '80px', color: '#3b82f6' }} />
            </div>
            <h2 className="text-xl font-bold mb-2 text-center">Scan QR Code</h2>
            <p className="text-gray-500 text-center mb-6 max-w-xs">
              Point your camera at the QR code on an inventory item to view its details
            </p>
            <IonButton expand="block" onClick={startScanner} className="mb-4 w-full max-w-xs">
              <IonIcon icon={scanOutline} slot="start" />
              Start Scanning
            </IonButton>

            {/* Manual Entry */}
            <div className="w-full max-w-xs mt-4">
              <p className="text-center text-sm text-gray-500 mb-2">Or enter code manually:</p>
              <IonItem className="rounded-lg overflow-hidden">
                <IonInput
                  value={manualCode}
                  onIonInput={(e) => setManualCode(e.detail.value || '')}
                  placeholder="e.g., INV-001-LAPTOP"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleManualSearch();
                  }}
                />
              </IonItem>
              <IonButton
                expand="block"
                fill="outline"
                onClick={handleManualSearch}
                className="mt-3"
                disabled={!manualCode.trim()}
              >
                Search
              </IonButton>
            </div>

            {/* Quick Scan Demo */}
            <div className="w-full max-w-xs mt-6">
              <p className="text-center text-sm text-gray-500 mb-3">Quick Demo:</p>
              <div className="grid grid-cols-2 gap-2">
                {['INV-001-LAPTOP', 'INV-002-MONITOR', 'INV-003-CHAIR', 'INV-005-TABLET'].map(
                  (code) => (
                    <IonButton
                      key={code}
                      fill="outline"
                      size="small"
                      onClick={() => handleScanResult(code)}
                      className="text-xs"
                    >
                      {code.split('-').slice(1).join('-')}
                    </IonButton>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {scanning && (
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-sm rounded-xl overflow-hidden shadow-lg mb-4">
              <div id="qr-reader" className="w-full" style={{ border: 'none' }}></div>
              <div className="absolute top-3 right-3">
                <IonButton
                  fill="clear"
                  color="light"
                  shape="round"
                  onClick={toggleFlash}
                  className="!bg-white/80"
                >
                  <IonIcon icon={flashOn ? flashOutline : flashOffOutline} />
                </IonButton>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">Position the QR code within the frame</p>
            <IonButton color="danger" onClick={stopScanner} fill="outline">
              Stop Scanning
            </IonButton>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <IonSpinner name="crescent" className="mb-4" />
            <p className="text-gray-500">Looking up item...</p>
          </div>
        )}

        {scannedItem && (
          <div className="flex flex-col items-center">
            <IonCard className="w-full max-w-md !m-0">
              <IonCardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <IonAvatar className="!w-32 !h-32 rounded-xl overflow-hidden shadow-md">
                    <img
                      src={scannedItem.image}
                      alt={scannedItem.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23e2e8f0" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%2394a3b8" font-size="12">No Image</text></svg>';
                      }}
                    />
                  </IonAvatar>
                </div>
                <IonCardTitle className="text-lg">{scannedItem.name}</IonCardTitle>
                <IonBadge color={getStatusColor(scannedItem.status)} className="mt-2">
                  {scannedItem.status.replace('-', ' ').toUpperCase()}
                </IonBadge>
              </IonCardHeader>
              <IonCardContent>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase font-medium">Owner</p>
                    <p className="font-semibold">{scannedItem.ownerName}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase font-medium">Location</p>
                    <p className="font-semibold">{scannedItem.location}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase font-medium">Category</p>
                    <p className="font-semibold">{scannedItem.category}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase font-medium">Serial Number</p>
                    <p className="font-semibold font-mono text-sm">{scannedItem.serialNumber}</p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            <div className="flex gap-3 mt-4 w-full max-w-md">
              <IonButton expand="block" onClick={() => navigate(`/item/${scannedItem.id}`)}>
                View Details
              </IonButton>
              <IonButton expand="block" fill="outline" onClick={() => setScannedItem(null)}>
                Scan Again
              </IonButton>
            </div>
          </div>
        )}

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Item Not Found"
          message={error}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Scanner;
