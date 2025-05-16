import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './menu/Header';
import Footer from './menu/Footer';
import SpinWheel from './components/SpinWheel';
import LatestOffers from './components/LatestOffers';
import Branches from './components/Branches';
import SuggestProduct from './components/SuggestProduct';
import Feedback from './components/Feedback';
import EidAlAdha from './components/EidAlAdha';
import { LanguageProvider } from './context/LanguageContext';

// کامپوننت داخلی برای مدیریت محتوا
function AppContent() {
    const location = useLocation();
    const hideHeaderFooter = location.pathname === '/eid-al-adha';

    return (
        <div className="min-h-screen bg-hyperWhite flex flex-col">
            {!hideHeaderFooter && <Header />}
            <main className="container mx-auto px-4 py-8 pt-20 flex-grow">
                <Routes>
                    <Route path="/" element={<SpinWheel />} />
                    <Route path="/offers" element={<LatestOffers />} />
                    <Route path="/branches" element={<Branches />} />
                    <Route path="/suggest" element={<SuggestProduct />} />
                    <Route path="/feedback" element={<Feedback />} />
                    <Route path="/eid-al-adha" element={<EidAlAdha />} />
                </Routes>
            </main>
            {!hideHeaderFooter && <Footer />}
        </div>
    );
}

function App() {
    return (
        <LanguageProvider>
            <Router>
                <AppContent />
            </Router>
        </LanguageProvider>
    );
}

export default App;