import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import gruvboxTheme from './theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AddAsset from './pages/AddAsset';
import EditAsset from './pages/EditAsset';
import DeletedAssets from './pages/DeletedAssets';

function App() {
  return (
    <ThemeProvider theme={gruvboxTheme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddAsset />} />
            <Route path="/edit/:id" element={<EditAsset />} />
            <Route path="/deleted" element={<DeletedAssets />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
