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
import { scanOutline, cubeOutline, businessOutline, hardwareChipOutline, alertCircleOutline } from 'ionicons/icons';
import { InventoryItem, Category, Status } from '../types';
import { getInventoryItems, getStatusColor, getCategoryHexColor } from '../data/inventory';
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
      if (segment === 'Fixed' || segment === 'Electronics') {
        filtered = filtered.filter((item) => item.category === segment);
      } else {
        filtered = filtered.filter((item) => item.status === segment);
      }
    }

    if (searchText) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.itemName.toLowerCase().includes(search) ||
          item.designatedOwner.toLowerCase().includes(search) ||
          item.category.toLowerCase().includes(search) ||
          item.assetNumber.toLowerCase().includes(search) ||
          item.itemDescription.toLowerCase().includes(search)
      );
    }

    setFilteredItems(filtered);
  };

  const getStatusCounts = () => {
    return {
      total: items.length,
      Good: items.filter((i) => i.status === 'Good').length,
      'Has Defects': items.filter((i) => i.status === 'Has Defects').length,
      BAD: items.filter((i) => i.status === 'BAD').length,
    };
  };

  const getCategoryCounts = () => {
    return {
      Fixed: items.filter((i) => i.category === 'Fixed').length,
      Electronics: items.filter((i) => i.category === 'Electronics').length,
    };
  };

  const statusCounts = getStatusCounts();
  const categoryCounts = getCategoryCounts();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ color: '#282828' }}>WhatTheTag</IonTitle>
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
                  <p className="text-2xl font-bold" style={{ color: '#458588' }}>{statusCounts.total}</p>
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
                  <p className="text-2xl font-bold" style={{ color: '#98971a' }}>{statusCounts.Good}</p>
                  <p className="text-xs" style={{ color: '#665c54' }}>Good</p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
          <IonCard className="!m-0" style={{ borderLeft: '4px solid #d79921', background: '#ebdbb2' }}>
            <IonCardContent className="!p-3">
              <div className="flex items-center gap-2">
                <IonIcon icon="warning" style={{ fontSize: '24px', color: '#d79921' }} />
                <div>
                  <p className="text-2xl font-bold" style={{ color: '#d79921' }}>{statusCounts['Has Defects']}</p>
                  <p className="text-xs" style={{ color: '#665c54' }}>Has Defects</p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
          <IonCard className="!m-0" style={{ borderLeft: '4px solid #cc241d', background: '#ebdbb2' }}>
            <IonCardContent className="!p-3">
              <div className="flex items-center gap-2">
                <IonIcon icon={alertCircleOutline} style={{ fontSize: '24px', color: '#cc241d' }} />
                <div>
                  <p className="text-2xl font-bold" style={{ color: '#cc241d' }}>{statusCounts.BAD}</p>
                  <p className="text-xs" style={{ color: '#665c54' }}>BAD</p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <IonCard className="!m-0" style={{ borderLeft: '4px solid #689d6a', background: '#ebdbb2' }}>
            <IonCardContent className="!p-3">
              <div className="flex items-center gap-2">
                <IonIcon icon={businessOutline} style={{ fontSize: '24px', color: '#689d6a' }} />
                <div>
                  <p className="text-2xl font-bold" style={{ color: '#689d6a' }}>{categoryCounts.Fixed}</p>
                  <p className="text-xs" style={{ color: '#665c54' }}>Fixed Assets</p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
          <IonCard className="!m-0" style={{ borderLeft: '4px solid #458588', background: '#ebdbb2' }}>
            <IonCardContent className="!p-3">
              <div className="flex items-center gap-2">
                <IonIcon icon={hardwareChipOutline} style={{ fontSize: '24px', color: '#458588' }} />
                <div>
                  <p className="text-2xl font-bold" style={{ color: '#458588' }}>{categoryCounts.Electronics}</p>
                  <p className="text-xs" style={{ color: '#665c54' }}>Electronics</p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Search */}
        <IonSearchbar
          value={searchText}
          onIonInput={(e) => setSearchText(e.detail.value || '')}
          placeholder="Search items, owners, asset numbers..."
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
            <IonLabel>All ({statusCounts.total})</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="Good">
            <IonLabel>Good</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="Has Defects">
            <IonLabel>Defects</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="BAD">
            <IonLabel>BAD</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="Fixed">
            <IonLabel>Fixed</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="Electronics">
            <IonLabel>Electronics</IonLabel>
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
                      alt={item.itemName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23d5c4a1" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%237c6f64" font-size="12">No Image</text></svg>';
                      }}
                    />
                  </IonAvatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1" style={{ color: '#282828' }}>{item.itemName}</h3>
                    <p className="text-xs mb-1" style={{ color: '#665c54' }}>{item.designatedOwner}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <IonBadge 
                        color={getStatusColor(item.status)} 
                        className="text-xs"
                        style={{ whiteSpace: 'nowrap', padding: '4px 8px', height: 'auto' }}
                      >
                        {item.status.toUpperCase()}
                      </IonBadge>
                      <IonChip 
                        className="!m-0 text-xs" 
                        style={{ 
                          background: getCategoryHexColor(item.category), 
                          color: '#fbf1c7',
                          margin: '0',
                          height: '24px'
                        } as any}
                      >
                        <IonLabel style={{ margin: '0 8px', whiteSpace: 'nowrap' }}>{item.category}</IonLabel>
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
