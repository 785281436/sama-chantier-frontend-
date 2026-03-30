import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import PrivateRoute from './components/common/PrivateRoute'
import AdminRoute from './components/common/AdminRoute'

import HomePage from './pages/HomePage'
import CataloguePage from './pages/CataloguePage'
import ProductPage from './pages/ProductPage'
import WorkersPage from './pages/WorkersPage'
import WorkerPage from './pages/WorkerPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import ProfilePage from './pages/ProfilePage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts  from './pages/admin/AdminProducts'
import AdminOrders    from './pages/admin/AdminOrders'
import AdminWorkers   from './pages/admin/AdminWorkers'
import QuotesPage     from './pages/QuotesPage'
import MessagesPage   from './pages/MessagesPage'
import PaymentReturnPage from './pages/PaymentReturnPage'

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <main>
            <Routes>
              <Route path="/"            element={<HomePage />} />
              <Route path="/catalogue"   element={<CataloguePage />} />
              <Route path="/produits/:id" element={<ProductPage />} />
              <Route path="/ouvriers"    element={<WorkersPage />} />
              <Route path="/ouvriers/:id" element={<WorkerPage />} />
              <Route path="/login"       element={<LoginPage />} />
              <Route path="/register"    element={<RegisterPage />} />

              <Route element={<PrivateRoute />}>
                <Route path="/panier"         element={<CartPage />} />
                <Route path="/commande"       element={<CheckoutPage />} />
                <Route path="/profil"         element={<ProfilePage />} />
                <Route path="/mes-commandes"  element={<OrdersPage />} />
                <Route path="/mes-commandes/:id" element={<OrderDetailPage />} />
                <Route path="/devis"           element={<QuotesPage />} />
                <Route path="/messages"        element={<MessagesPage />} />
                <Route path="/paiement/retour" element={<PaymentReturnPage />} />
              </Route>

              <Route element={<AdminRoute />}>
                <Route path="/admin"           element={<AdminDashboard />} />
                <Route path="/admin/produits"  element={<AdminProducts />} />
                <Route path="/admin/commandes" element={<AdminOrders />} />
                <Route path="/admin/ouvriers"  element={<AdminWorkers />} />
              </Route>
            </Routes>
          </main>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App