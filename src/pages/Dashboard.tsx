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
        <IonToolbar color="primary">
          <IonTitle>Inventory Dashboard</IonTitle>
          <IonIcon
            icon={scanOutline}
            slot="end"
            className="cursor-pointer mr-4 text-2xl"
            onClick={() => navigate('/scanner')}
            style={{ fontSize: '24px', cursor: 'pointer' }}
          />
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <IonCard className="!m-0 !bg-blue-50 !border-l-4 !border-blue-500">
            <IonCardContent className="!p-3">
              <div className="flex items-center gap-2">
                <IonIcon icon={cubeOutline} color="primary" style={{ fontSize: '24px' }} />
                <div>
                  <p className="text-2xl font-bold text-blue-700">{counts.total}</p>
                  <p className="text-xs text-gray-600">Total Items</p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
          <IonCard className="!m-0 !bg-green-50 !border-l-4 !border-green-500">
            <IonCardContent className="!p-3">
              <div className="flex items-center gap-2">
                <IonIcon icon="checkmark-circle" color="success" style={{ fontSize: '24px' }} />
                <div>
                  <p className="text-2xl font-bold text-green-700">{counts.available}</p>
                  <p className="text-xs text-gray-600">Available</p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
          <IonCard className="!m-0 !bg-indigo-50 !border-l-4 !border-indigo-500">
            <IonCardContent className="!p-3">
              <div className="flex items-center gap-2">
                <IonIcon icon={peopleOutline} color="primary" style={{ fontSize: '24px' }} />
                <div>
                  <p className="text-2xl font-bold text-indigo-700">{counts['in-use']}</p>
                  <p className="text-xs text-gray-600">In Use</p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
          <IonCard className="!m-0 !bg-amber-50 !border-l-4 !border-amber-500">
            <IonCardContent className="!p-3">
              <div className="flex items-center gap-2">
                <IonIcon icon={alertCircleOutline} color="warning" style={{ fontSize: '24px' }} />
                <div>
                  <p className="text-2xl font-bold text-amber-700">{counts.maintenance}</p>
                  <p className="text-xs text-gray-600">Maintenance</p>
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
            <IonSpinner name="crescent" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <IonIcon icon={cubeOutline} style={{ fontSize: '48px' }} className="mb-2 opacity-50" />
            <p>No items found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <IonCard
                key={item.id}
                className="!m-0 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/item/${item.id}`)}
              >
                <IonItem lines="none" className="!--padding-start-0">
                  <IonAvatar slot="start" className="!w-16 !h-16 !rounded-lg overflow-hidden mr-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23e2e8f0" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%2394a3b8" font-size="12">No Image</text></svg>';
                      }}
                    />
                  </IonAvatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
                    <p className="text-xs text-gray-500 mb-1">{item.ownerName}</p>
                    <div className="flex items-center gap-2">
                      <IonBadge color={getStatusColor(item.status)} className="text-xs">
                        {item.status.replace('-', ' ').toUpperCase()}
                      </IonBadge>
                      <IonChip className="!m-0 !h-6 text-xs">
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
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-700 transition-colors z-50"
          onClick={() => navigate('/scanner')}
        >
          <IonIcon icon={scanOutline} style={{ fontSize: '28px', color: 'white' }} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
