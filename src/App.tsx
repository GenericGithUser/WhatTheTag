import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Routes, Route, Navigate } from 'react-router-dom';

/* Ionic CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Ionicons */
import { addIcons } from 'ionicons';
import { 
  scanOutline, 
  cubeOutline, 
  businessOutline, 
  hardwareChipOutline, 
  alertCircleOutline,
  checkmarkCircle,
  warning,
  closeCircle,
  personOutline,
  pricetagOutline,
  calendarOutline,
  documentTextOutline,
  flashOutline,
  flashOffOutline,
  alertCircle,
  helpCircle
} from 'ionicons/icons';

/* Register icons */
addIcons({
  'scan-outline': scanOutline,
  'cube-outline': cubeOutline,
  'business-outline': businessOutline,
  'hardware-chip-outline': hardwareChipOutline,
  'alert-circle-outline': alertCircleOutline,
  'checkmark-circle': checkmarkCircle,
  'warning': warning,
  'close-circle': closeCircle,
  'person-outline': personOutline,
  'pricetag-outline': pricetagOutline,
  'calendar-outline': calendarOutline,
  'document-text-outline': documentTextOutline,
  'flash-outline': flashOutline,
  'flash-off-outline': flashOffOutline,
  'alert-circle': alertCircle,
  'help-circle': helpCircle
});

/* Pages */
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import ItemDetail from './pages/ItemDetail';

/* Initialize Ionic */
setupIonicReact({
  mode: 'md',
});

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
        </Routes>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
