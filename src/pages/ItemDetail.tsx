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
  personOutline,
  pricetagOutline,
  calendarOutline,
  documentTextOutline,
  businessOutline,
  hardwareChipOutline,
} from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import { InventoryItem } from '../types';
import { getInventoryItemById, getStatusColor, getStatusHexColor, getStatusIcon, getCategoryHexColor, getCategoryIcon } from '../data/inventory';

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
            <IonTitle style={{ color: '#282828' }}>Asset Details</IonTitle>
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
            <IonTitle style={{ color: '#282828' }}>Asset Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="text-center py-12">
            <IonIcon icon="alert-circle" style={{ fontSize: '48px' }} color="danger" />
            <h2 className="mt-4 text-lg font-semibold" style={{ color: '#282828' }}>
              Asset Not Found
            </h2>
            <p style={{ color: '#665c54' }}>The requested inventory asset could not be found.</p>
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
            <IonBackButton defaultHref="/" text="Dashboard" />
          </IonButtons>
          <IonTitle style={{ color: '#282828' }}>Asset Details</IonTitle>
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
            alt={item.itemName}
            className="w-full h-56 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><rect fill="%23d5c4a1" width="400" height="200"/><text x="200" y="105" text-anchor="middle" fill="%237c6f64" font-size="16">No Image Available</text></svg>';
            }}
          />
        </div>

        {/* Title & Badges */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold" style={{ color: '#282828' }}>
            {item.itemName}
          </h1>
          <p className="text-sm mt-1 font-mono" style={{ color: '#458588' }}>
            {item.assetNumber}
          </p>
          <div className="flex gap-2 mt-2">
            <IonBadge color={getStatusColor(item.status)} className="text-sm px-3 py-1">
              <IonIcon icon={getStatusIcon(item.status)} className="mr-1" />
              {item.status.toUpperCase()}
            </IonBadge>
            <IonBadge 
              className="text-sm px-3 py-1"
              style={{ background: getCategoryHexColor(item.category), color: '#fbf1c7' } as any}
            >
              <IonIcon icon={getCategoryIcon(item.category)} className="mr-1" />
              {item.category}
            </IonBadge>
          </div>
        </div>

        {/* Description */}
        <IonCard className="!m-0 mb-4" style={{ background: '#ebdbb2' }}>
          <IonCardContent>
            <p className="leading-relaxed" style={{ color: '#504945' }}>
              {item.itemDescription}
            </p>
          </IonCardContent>
        </IonCard>

        {/* Details */}
        <IonCard className="!m-0 mb-4" style={{ background: '#ebdbb2' }}>
          <IonCardHeader>
            <IonCardTitle className="text-base" style={{ color: '#282828' }}>
              Asset Information
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem lines="full" className="!pl-0">
              <IonIcon icon={pricetagOutline} slot="start" style={{ color: '#458588' }} />
              <IonLabel>
                <p className="text-xs" style={{ color: '#665c54' }}>Asset Number</p>
                <p className="font-semibold font-mono" style={{ color: '#458588' }}>{item.assetNumber}</p>
              </IonLabel>
            </IonItem>
            <IonItem lines="full" className="!pl-0">
              <IonIcon icon={personOutline} slot="start" style={{ color: '#d65d0e' }} />
              <IonLabel>
                <p className="text-xs" style={{ color: '#665c54' }}>Designated Owner</p>
                <p className="font-semibold" style={{ color: '#282828' }}>{item.designatedOwner}</p>
              </IonLabel>
            </IonItem>
            <IonItem lines="full" className="!pl-0">
              <IonIcon icon={item.category === 'Fixed' ? businessOutline : hardwareChipOutline} slot="start" style={{ color: getCategoryHexColor(item.category) }} />
              <IonLabel>
                <p className="text-xs" style={{ color: '#665c54' }}>Category</p>
                <p className="font-semibold" style={{ color: '#282828' }}>{item.category}</p>
              </IonLabel>
            </IonItem>
            <IonItem lines="full" className="!pl-0">
              <IonIcon icon={getStatusIcon(item.status)} slot="start" style={{ color: getStatusHexColor(item.status) }} />
              <IonLabel>
                <p className="text-xs" style={{ color: '#665c54' }}>Status</p>
                <p className="font-semibold" style={{ color: getStatusHexColor(item.status) }}>{item.status}</p>
              </IonLabel>
            </IonItem>
            {item.updatedAt && (
              <IonItem lines="none" className="!pl-0">
                <IonIcon icon={calendarOutline} slot="start" style={{ color: '#98971a' }} />
                <IonLabel>
                  <p className="text-xs" style={{ color: '#665c54' }}>Last Updated</p>
                  <p className="font-semibold" style={{ color: '#282828' }}>
                    {new Date(item.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </IonLabel>
              </IonItem>
            )}
          </IonCardContent>
        </IonCard>

        {/* QR Code Display */}
        <IonCard className="!m-0 mb-4" style={{ background: '#ebdbb2' }}>
          <IonCardHeader>
            <IonCardTitle className="text-base" style={{ color: '#282828' }}>
              Asset Tag
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
                  {/* Generate a simple QR-like pattern based on the asset number */}
                  {Array.from({ length: 10 }, (_, row) =>
                    Array.from({ length: 10 }, (_, col) => {
                      const hash =
                        (item.assetNumber.charCodeAt((row * 10 + col) % item.assetNumber.length) + row * col) % 3;
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
              {item.assetNumber}
            </p>
          </IonCardContent>
        </IonCard>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          <IonChip style={{ background: getCategoryHexColor(item.category), color: '#fbf1c7' } as any}>
            <IonLabel>{item.category}</IonLabel>
          </IonChip>
          <IonChip color={getStatusColor(item.status)}>
            <IonLabel>{item.status}</IonLabel>
          </IonChip>
          <IonChip style={{ background: '#d5c4a1', color: '#3c3836' } as any}>
            <IonLabel>{item.designatedOwner}</IonLabel>
          </IonChip>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ItemDetail;
