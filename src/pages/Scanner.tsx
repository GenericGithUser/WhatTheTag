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
import { scanOutline, flashOutline, flashOffOutline } from 'ionicons/icons';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { InventoryItem } from '../types';
import { getInventoryItemByAssetNumber, getStatusColor, getCategoryHexColor } from '../data/inventory';
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

  const handleScanResult = async (assetNumber: string) => {
    stopScanner();
    setLoading(true);

    try {
      const item = await getInventoryItemByAssetNumber(assetNumber);
      if (item) {
        setScannedItem(item);
      } else {
        setError(`No inventory item found for asset number: ${assetNumber}`);
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
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" text="Dashboard" />
          </IonButtons>
          <IonTitle style={{ color: '#282828' }}>Scan Asset</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {!scanning && !scannedItem && (
          <div className="flex flex-col items-center justify-center py-8">
            <div
              className="w-48 h-48 rounded-full flex items-center justify-center mb-6"
              style={{ background: 'linear-gradient(135deg, #ebdbb2, #d5c4a1)' }}
            >
              <IonIcon icon={scanOutline} style={{ fontSize: '80px', color: '#458588' }} />
            </div>
            <h2 className="text-xl font-bold mb-2 text-center" style={{ color: '#282828' }}>
              Scan Asset Tag
            </h2>
            <p className="text-center mb-6 max-w-xs" style={{ color: '#665c54' }}>
              Point your camera at the QR code or barcode on an asset to view its details
            </p>
            <IonButton
              expand="block"
              onClick={startScanner}
              className="mb-4 w-full max-w-xs"
              style={{ '--background': '#458588', '--background-hover': '#3d7578', '--color': '#fbf1c7' } as any}
            >
              <IonIcon icon={scanOutline} slot="start" />
              Start Scanning
            </IonButton>

            {/* Manual Entry */}
            <div className="w-full max-w-xs mt-4">
              <p className="text-center text-sm mb-2" style={{ color: '#7c6f64' }}>
                Or enter asset number manually:
              </p>
              <IonItem className="rounded-lg overflow-hidden" style={{ '--background': '#ebdbb2' } as any}>
                <IonInput
                  value={manualCode}
                  onIonInput={(e) => setManualCode(e.detail.value || '')}
                  placeholder="e.g., AST-001"
                  style={{ '--color': '#282828', '--placeholder-color': '#7c6f64' } as any}
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
                style={{ '--border-color': '#458588', '--color': '#458588', '--color-hover': '#3d7578' } as any}
              >
                Search
              </IonButton>
            </div>

            {/* Quick Scan Demo */}
            <div className="w-full max-w-xs mt-6">
              <p className="text-center text-sm mb-3" style={{ color: '#7c6f64' }}>
                Quick Demo:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['AST-001', 'AST-002', 'AST-003', 'AST-004', 'AST-005', 'AST-006'].map(
                  (code) => (
                    <IonButton
                      key={code}
                      fill="outline"
                      size="small"
                      onClick={() => handleScanResult(code)}
                      className="text-xs"
                      style={{ '--border-color': '#689d6a', '--color': '#689d6a' } as any}
                    >
                      {code}
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
                  style={{ '--background': 'rgba(235, 219, 178, 0.8)' } as any}
                >
                  <IonIcon icon={flashOn ? flashOutline : flashOffOutline} style={{ color: '#d65d0e' }} />
                </IonButton>
              </div>
            </div>
            <p className="text-sm mb-4" style={{ color: '#665c54' }}>
              Position the QR code or barcode within the frame
            </p>
            <IonButton
              color="danger"
              onClick={stopScanner}
              fill="outline"
              style={{ '--border-color': '#cc241d', '--color': '#cc241d' } as any}
            >
              Stop Scanning
            </IonButton>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <IonSpinner name="crescent" className="mb-4" style={{ color: '#458588' }} />
            <p style={{ color: '#665c54' }}>Looking up asset...</p>
          </div>
        )}

        {scannedItem && (
          <div className="flex flex-col items-center">
            <IonCard className="w-full max-w-md !m-0" style={{ background: '#ebdbb2' }}>
              <IonCardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <IonAvatar className="!w-32 !h-32 rounded-xl overflow-hidden shadow-md">
                    <img
                      src={scannedItem.image}
                      alt={scannedItem.itemName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23d5c4a1" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%237c6f64" font-size="12">No Image</text></svg>';
                      }}
                    />
                  </IonAvatar>
                </div>
                <IonCardTitle className="text-lg" style={{ color: '#282828' }}>
                  {scannedItem.itemName}
                </IonCardTitle>
                <p className="text-sm mt-1" style={{ color: '#665c54' }}>
                  Asset: {scannedItem.assetNumber}
                </p>
                <div className="flex gap-2 justify-center mt-2">
                  <IonBadge color={getStatusColor(scannedItem.status)}>
                    {scannedItem.status.toUpperCase()}
                  </IonBadge>
                  <IonBadge style={{ background: getCategoryHexColor(scannedItem.category), color: '#fbf1c7' } as any}>
                    {scannedItem.category}
                  </IonBadge>
                </div>
              </IonCardHeader>
              <IonCardContent>
                <div className="space-y-3">
                  <div className="rounded-lg p-3" style={{ background: '#d5c4a1' }}>
                    <p className="text-xs uppercase font-medium" style={{ color: '#665c54' }}>Designated Owner</p>
                    <p className="font-semibold" style={{ color: '#282828' }}>{scannedItem.designatedOwner}</p>
                  </div>
                  <div className="rounded-lg p-3" style={{ background: '#d5c4a1' }}>
                    <p className="text-xs uppercase font-medium" style={{ color: '#665c54' }}>Description</p>
                    <p className="text-sm" style={{ color: '#282828' }}>{scannedItem.itemDescription}</p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            <div className="flex gap-3 mt-4 w-full max-w-md">
              <IonButton
                expand="block"
                onClick={() => navigate(`/item/${scannedItem.id}`)}
                style={{ '--background': '#458588', '--color': '#fbf1c7' } as any}
              >
                View Details
              </IonButton>
              <IonButton
                expand="block"
                fill="outline"
                onClick={() => setScannedItem(null)}
                style={{ '--border-color': '#d65d0e', '--color': '#d65d0e' } as any}
              >
                Scan Again
              </IonButton>
            </div>
          </div>
        )}

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Asset Not Found"
          message={error}
          buttons={['OK']}
          cssClass="gruvbox-alert"
        />
      </IonContent>
    </IonPage>
  );
};

export default Scanner;
