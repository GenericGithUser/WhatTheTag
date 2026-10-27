import { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonBadge,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSpinner,
  IonIcon,
  IonChip,
  IonItem,
  IonAvatar,
} from '@ionic/react';
import { scanOutline, cubeOutline, peopleOutline, alertCircleOutline } from 'ionicons/icons';
import { InventoryItem } from '../types';
import { getInventoryItems, getStatusColor } from '../data/inventory';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [segment, setSegment] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchText, segment]);

  const loadItems = async () => {
    setLoading(true);
    const data = await getInventoryItems();
    setItems(data);
    setLoading(false);
  };

  const filterItems = () => {
    let filtered = items;

    if (segment !== 'all') {
      filtered = filtered.filter((item) => item.status === segment);
    }

    if (searchText) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(search) ||
          item.ownerName.toLowerCase().includes(search) ||
          item.category.toLowerCase().includes(search) ||
          item.qrCode.toLowerCase().includes(search)
      );
    }

    setFilteredItems(filtered);
  };

  const getStatusCounts = () => {
    return {
      total: items.length,
      available: items.filter((i) => i.status === 'available').length,
      'in-use': items.filter((i) => i.status === 'in-use').length,
      maintenance: items.filter((i) => i.status === 'maintenance').length,
      retired: items.filter((i) => i.status === 'retired').length,
    };
  };

  const counts = getStatusCounts();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ color: '#282828' }}>Inventory Dashboard</IonTitle>
          <IonIcon
            icon={scanOutline}
            slot="end"
            onClick={() => navigate('/scanner')}
            style={{ fontSize: '24px', cursor: 'pointer', color: '#458588', marginRight: '16px' }}
          />
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <IonCard className="!m-0" style={{ borderLeft: '4px solid #458588', background: '#ebdbb2' }}>
            <IonCardContent className="!p-3">
              <div className="flex items-center gap-2">
                <IonIcon icon={cubeOutline} style={{ fontSize: '24px', color: '#458588' }} />
                <div>
                  <p className="text-2xl font-bold" style={{ color: '#458588' }}>{counts.total}</p>
                  <p className="text-xs" style={{ color: '#665c54' }}>Total Items</p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
          <IonCard className="!m-0" style={{ borderLeft: '4px solid #98971a', background: '#ebdbb2' }}>
            <IonCardContent className="!p-3">
              <div className="flex items-center gap-2">
                <IonIcon icon="checkmark-circle" style={{ fontSize: '24px', color: '#98971a' }} />
                <div>
                  <p className="text-2xl font-bold" style={{ color: '#98971a' }}>{counts.available}</p>
                  <p className="text-xs" style={{ color: '#665c54' }}>Available</p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
          <IonCard className="!m-0" style={{ borderLeft: '4px solid #d65d0e', background: '#ebdbb2' }}>
            <IonCardContent className="!p-3">
              <div className="flex items-center gap-2">
                <IonIcon icon={peopleOutline} style={{ fontSize: '24px', color: '#d65d0e' }} />
                <div>
                  <p className="text-2xl font-bold" style={{ color: '#d65d0e' }}>{counts['in-use']}</p>
                  <p className="text-xs" style={{ color: '#665c54' }}>In Use</p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
          <IonCard className="!m-0" style={{ borderLeft: '4px solid #cc241d', background: '#ebdbb2' }}>
            <IonCardContent className="!p-3">
              <div className="flex items-center gap-2">
                <IonIcon icon={alertCircleOutline} style={{ fontSize: '24px', color: '#cc241d' }} />
                <div>
                  <p className="text-2xl font-bold" style={{ color: '#cc241d' }}>{counts.maintenance}</p>
                  <p className="text-xs" style={{ color: '#665c54' }}>Maintenance</p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Search */}
        <IonSearchbar
          value={searchText}
          onIonInput={(e) => setSearchText(e.detail.value || '')}
          placeholder="Search items, owners, categories..."
          className="mb-3"
          debounce={300}
        />

        {/* Segment Filter */}
        <IonSegment
          value={segment}
          onIonChange={(e) => setSegment(e.detail.value as string)}
          scrollable
          className="mb-4"
        >
          <IonSegmentButton value="all">
            <IonLabel>All ({counts.total})</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="available">
            <IonLabel>Available</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="in-use">
            <IonLabel>In Use</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="maintenance">
            <IonLabel>Maintenance</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="retired">
            <IonLabel>Retired</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {/* Items List */}
        {loading ? (
          <div className="flex justify-center py-8">
            <IonSpinner name="crescent" style={{ color: '#458588' }} />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8" style={{ color: '#7c6f64' }}>
            <IonIcon icon={cubeOutline} style={{ fontSize: '48px', color: '#bdae93' }} className="mb-2" />
            <p>No items found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <IonCard
                key={item.id}
                className="!m-0 cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => navigate(`/item/${item.id}`)}
                style={{ background: '#ebdbb2' }}
              >
                <IonItem lines="none" className="!--padding-start-0">
                  <IonAvatar slot="start" className="!w-16 !h-16 !rounded-lg overflow-hidden mr-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23d5c4a1" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%237c6f64" font-size="12">No Image</text></svg>';
                      }}
                    />
                  </IonAvatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1" style={{ color: '#282828' }}>{item.name}</h3>
                    <p className="text-xs mb-1" style={{ color: '#665c54' }}>{item.ownerName}</p>
                    <div className="flex items-center gap-2">
                      <IonBadge color={getStatusColor(item.status)} className="text-xs">
                        {item.status.replace('-', ' ').toUpperCase()}
                      </IonBadge>
                      <IonChip className="!m-0 !h-6 text-xs" style={{ background: '#d5c4a1', color: '#3c3836' } as any}>
                        <IonLabel>{item.category}</IonLabel>
                      </IonChip>
                    </div>
                  </div>
                </IonItem>
              </IonCard>
            ))}
          </div>
        )}

        {/* Scan FAB */}
        <div
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-colors z-50"
          style={{ backgroundColor: '#d65d0e' }}
          onClick={() => navigate('/scanner')}
        >
          <IonIcon icon={scanOutline} style={{ fontSize: '28px', color: '#fbf1c7' }} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
