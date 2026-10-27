import { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonSpinner,
  IonIcon,
  IonBackButton,
  IonButtons,
  IonChip,
  IonItem,
  IonLabel,
} from '@ionic/react';
import {
  locationOutline,
  personOutline,
  pricetagOutline,
  calendarOutline,
  documentTextOutline,
  hardwareChipOutline,
} from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import { InventoryItem } from '../types';
import { getInventoryItemById, getStatusColor, getStatusIcon } from '../data/inventory';

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    if (!id) return;
    setLoading(true);
    const data = await getInventoryItemById(id);
    setItem(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" text="Back" />
            </IonButtons>
            <IonTitle>Item Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="flex items-center justify-center">
          <div className="flex justify-center items-center h-full">
            <IonSpinner name="crescent" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!item) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" text="Back" />
            </IonButtons>
            <IonTitle>Item Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="text-center py-12">
            <IonIcon icon="alert-circle" style={{ fontSize: '48px' }} color="danger" />
            <h2 className="mt-4 text-lg font-semibold">Item Not Found</h2>
            <p className="text-gray-500">The requested inventory item could not be found.</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" text="Back" />
          </IonButtons>
          <IonTitle>Item Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* Hero Image */}
        <div className="w-full rounded-xl overflow-hidden shadow-lg mb-4 bg-gray-100">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-56 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><rect fill="%23e2e8f0" width="400" height="200"/><text x="200" y="105" text-anchor="middle" fill="%2394a3b8" font-size="16">No Image Available</text></svg>';
            }}
          />
        </div>

        {/* Title & Status */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{item.name}</h1>
            <p className="text-gray-500 text-sm mt-1">ID: {item.qrCode}</p>
          </div>
          <IonBadge color={getStatusColor(item.status)} className="text-sm px-3 py-1">
            <IonIcon icon={getStatusIcon(item.status)} className="mr-1" />
            {item.status.replace('-', ' ').toUpperCase()}
          </IonBadge>
        </div>

        {/* Description */}
        <IonCard className="!m-0 mb-4">
          <IonCardContent>
            <p className="text-gray-700 leading-relaxed">{item.description}</p>
          </IonCardContent>
        </IonCard>

        {/* Details */}
        <IonCard className="!m-0 mb-4">
          <IonCardHeader>
            <IonCardTitle className="text-base">Item Information</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem lines="full" className="!pl-0">
              <IonIcon icon={personOutline} slot="start" color="primary" />
              <IonLabel>
                <p className="text-xs text-gray-500">Owner</p>
                <p className="font-semibold">{item.ownerName}</p>
              </IonLabel>
            </IonItem>
            <IonItem lines="full" className="!pl-0">
              <IonIcon icon={locationOutline} slot="start" color="primary" />
              <IonLabel>
                <p className="text-xs text-gray-500">Location</p>
                <p className="font-semibold">{item.location}</p>
              </IonLabel>
            </IonItem>
            <IonItem lines="full" className="!pl-0">
              <IonIcon icon={pricetagOutline} slot="start" color="primary" />
              <IonLabel>
                <p className="text-xs text-gray-500">Category</p>
                <p className="font-semibold">{item.category}</p>
              </IonLabel>
            </IonItem>
            <IonItem lines="full" className="!pl-0">
              <IonIcon icon={hardwareChipOutline} slot="start" color="primary" />
              <IonLabel>
                <p className="text-xs text-gray-500">Serial Number</p>
                <p className="font-semibold font-mono text-sm">{item.serialNumber}</p>
              </IonLabel>
            </IonItem>
            <IonItem lines="full" className="!pl-0">
              <IonIcon icon={calendarOutline} slot="start" color="primary" />
              <IonLabel>
                <p className="text-xs text-gray-500">Purchase Date</p>
                <p className="font-semibold">{item.purchaseDate}</p>
              </IonLabel>
            </IonItem>
            <IonItem lines="none" className="!pl-0">
              <IonIcon icon={documentTextOutline} slot="start" color="primary" />
              <IonLabel>
                <p className="text-xs text-gray-500">Last Updated</p>
                <p className="font-semibold">{item.lastUpdated}</p>
              </IonLabel>
            </IonItem>
          </IonCardContent>
        </IonCard>

        {/* QR Code Display */}
        <IonCard className="!m-0 mb-4">
          <IonCardHeader>
            <IonCardTitle className="text-base">QR Code</IonCardTitle>
          </IonCardHeader>
          <IonCardContent className="text-center">
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 inline-block">
              <div className="w-32 h-32 mx-auto bg-white flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect width="100" height="100" fill="white" />
                  {/* Generate a simple QR-like pattern based on the code */}
                  {Array.from({ length: 10 }, (_, row) =>
                    Array.from({ length: 10 }, (_, col) => {
                      const hash = (item.qrCode.charCodeAt((row * 10 + col) % item.qrCode.length) + row * col) % 3;
                      if (hash === 0) {
                        return (
                          <rect
                            key={`${row}-${col}`}
                            x={col * 10}
                            y={row * 10}
                            width="10"
                            height="10"
                            fill="black"
                          />
                        );
                      }
                      return null;
                    })
                  )}
                  {/* Corner markers */}
                  <rect x="0" y="0" width="30" height="30" fill="none" stroke="black" strokeWidth="4" />
                  <rect x="5" y="5" width="20" height="20" fill="black" />
                  <rect x="70" y="0" width="30" height="30" fill="none" stroke="black" strokeWidth="4" />
                  <rect x="75" y="5" width="20" height="20" fill="black" />
                  <rect x="0" y="70" width="30" height="30" fill="none" stroke="black" strokeWidth="4" />
                  <rect x="5" y="75" width="20" height="20" fill="black" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2 font-mono">{item.qrCode}</p>
          </IonCardContent>
        </IonCard>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          <IonChip color="primary">
            <IonLabel>{item.category}</IonLabel>
          </IonChip>
          <IonChip color={getStatusColor(item.status)}>
            <IonLabel>{item.status}</IonLabel>
          </IonChip>
          <IonChip color="medium">
            <IonLabel>{item.location.split(',')[0]}</IonLabel>
          </IonChip>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ItemDetail;
