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
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" text="Back" />
            </IonButtons>
            <IonTitle style={{ color: '#282828' }}>Item Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="flex items-center justify-center">
          <div className="flex justify-center items-center h-full">
            <IonSpinner name="crescent" style={{ color: '#458588' }} />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!item) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" text="Back" />
            </IonButtons>
            <IonTitle style={{ color: '#282828' }}>Item Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="text-center py-12">
            <IonIcon icon="alert-circle" style={{ fontSize: '48px' }} color="danger" />
            <h2 className="mt-4 text-lg font-semibold" style={{ color: '#282828' }}>
              Item Not Found
            </h2>
            <p style={{ color: '#665c54' }}>The requested inventory item could not be found.</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" text="Back" />
          </IonButtons>
          <IonTitle style={{ color: '#282828' }}>Item Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* Hero Image */}
        <div
          className="w-full rounded-xl overflow-hidden shadow-lg mb-4"
          style={{ background: '#d5c4a1' }}
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-56 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><rect fill="%23d5c4a1" width="400" height="200"/><text x="200" y="105" text-anchor="middle" fill="%237c6f64" font-size="16">No Image Available</text></svg>';
            }}
          />
        </div>

        {/* Title & Status */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#282828' }}>
              {item.name}
            </h1>
            <p className="text-sm mt-1" style={{ color: '#665c54' }}>
              ID: {item.qrCode}
            </p>
          </div>
          <IonBadge color={getStatusColor(item.status)} className="text-sm px-3 py-1">
            <IonIcon icon={getStatusIcon(item.status)} className="mr-1" />
            {item.status.replace('-', ' ').toUpperCase()}
          </IonBadge>
        </div>

        {/* Description */}
        <IonCard className="!m-0 mb-4" style={{ background: '#ebdbb2' }}>
          <IonCardContent>
            <p className="leading-relaxed" style={{ color: '#504945' }}>
              {item.description}
            </p>
          </IonCardContent>
        </IonCard>

        {/* Details */}
        <IonCard className="!m-0 mb-4" style={{ background: '#ebdbb2' }}>
          <IonCardHeader>
            <IonCardTitle className="text-base" style={{ color: '#282828' }}>
              Item Information
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem lines="full" className="!pl-0">
              <IonIcon icon={personOutline} slot="start" style={{ color: '#458588' }} />
              <IonLabel>
                <p className="text-xs" style={{ color: '#665c54' }}>Owner</p>
                <p className="font-semibold" style={{ color: '#282828' }}>{item.ownerName}</p>
              </IonLabel>
            </IonItem>
            <IonItem lines="full" className="!pl-0">
              <IonIcon icon={locationOutline} slot="start" style={{ color: '#689d6a' }} />
              <IonLabel>
                <p className="text-xs" style={{ color: '#665c54' }}>Location</p>
                <p className="font-semibold" style={{ color: '#282828' }}>{item.location}</p>
              </IonLabel>
            </IonItem>
            <IonItem lines="full" className="!pl-0">
              <IonIcon icon={pricetagOutline} slot="start" style={{ color: '#d79921' }} />
              <IonLabel>
                <p className="text-xs" style={{ color: '#665c54' }}>Category</p>
                <p className="font-semibold" style={{ color: '#282828' }}>{item.category}</p>
              </IonLabel>
            </IonItem>
            <IonItem lines="full" className="!pl-0">
              <IonIcon icon={hardwareChipOutline} slot="start" style={{ color: '#458588' }} />
              <IonLabel>
                <p className="text-xs" style={{ color: '#665c54' }}>Serial Number</p>
                <p className="font-semibold font-mono text-sm" style={{ color: '#458588' }}>
                  {item.serialNumber}
                </p>
              </IonLabel>
            </IonItem>
            <IonItem lines="full" className="!pl-0">
              <IonIcon icon={calendarOutline} slot="start" style={{ color: '#d65d0e' }} />
              <IonLabel>
                <p className="text-xs" style={{ color: '#665c54' }}>Purchase Date</p>
                <p className="font-semibold" style={{ color: '#282828' }}>{item.purchaseDate}</p>
              </IonLabel>
            </IonItem>
            <IonItem lines="none" className="!pl-0">
              <IonIcon icon={documentTextOutline} slot="start" style={{ color: '#98971a' }} />
              <IonLabel>
                <p className="text-xs" style={{ color: '#665c54' }}>Last Updated</p>
                <p className="font-semibold" style={{ color: '#282828' }}>{item.lastUpdated}</p>
              </IonLabel>
            </IonItem>
          </IonCardContent>
        </IonCard>

        {/* QR Code Display */}
        <IonCard className="!m-0 mb-4" style={{ background: '#ebdbb2' }}>
          <IonCardHeader>
            <IonCardTitle className="text-base" style={{ color: '#282828' }}>
              QR Code
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent className="text-center">
            <div
              className="rounded-lg p-4 inline-block"
              style={{ background: '#fbf1c7', border: '2px dashed #bdae93' }}
            >
              <div className="w-32 h-32 mx-auto flex items-center justify-center" style={{ background: '#fbf1c7' }}>
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect width="100" height="100" fill="#fbf1c7" />
                  {/* Generate a simple QR-like pattern based on the code */}
                  {Array.from({ length: 10 }, (_, row) =>
                    Array.from({ length: 10 }, (_, col) => {
                      const hash =
                        (item.qrCode.charCodeAt((row * 10 + col) % item.qrCode.length) + row * col) % 3;
                      if (hash === 0) {
                        return (
                          <rect
                            key={`${row}-${col}`}
                            x={col * 10}
                            y={row * 10}
                            width="10"
                            height="10"
                            fill="#282828"
                          />
                        );
                      }
                      return null;
                    })
                  )}
                  {/* Corner markers */}
                  <rect x="0" y="0" width="30" height="30" fill="none" stroke="#282828" strokeWidth="4" />
                  <rect x="5" y="5" width="20" height="20" fill="#282828" />
                  <rect x="70" y="0" width="30" height="30" fill="none" stroke="#282828" strokeWidth="4" />
                  <rect x="75" y="5" width="20" height="20" fill="#282828" />
                  <rect x="0" y="70" width="30" height="30" fill="none" stroke="#282828" strokeWidth="4" />
                  <rect x="5" y="75" width="20" height="20" fill="#282828" />
                </svg>
              </div>
            </div>
            <p className="text-sm mt-2 font-mono" style={{ color: '#665c54' }}>
              {item.qrCode}
            </p>
          </IonCardContent>
        </IonCard>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          <IonChip style={{ background: '#458588', color: '#fbf1c7' } as any}>
            <IonLabel>{item.category}</IonLabel>
          </IonChip>
          <IonChip color={getStatusColor(item.status)}>
            <IonLabel>{item.status}</IonLabel>
          </IonChip>
          <IonChip style={{ background: '#d5c4a1', color: '#3c3836' } as any}>
            <IonLabel>{item.location.split(',')[0]}</IonLabel>
          </IonChip>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ItemDetail;
