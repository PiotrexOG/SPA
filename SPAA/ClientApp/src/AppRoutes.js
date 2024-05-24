import ApiAuthorzationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { Home } from "./components/Home";
import Contacts from './Contacts';

const AppRoutes = [
    {
        index: true,
        element: <Home /> // Ustawia komponent Home jako domyœln¹ stronê g³ówn¹ (index)
    },
    {
        path: '/contacts',
        element: <Contacts /> // Definiuje trasê "/contacts", która renderuje komponent Contacts
    },
    ...ApiAuthorzationRoutes // Rozszerza istniej¹ce trasy autoryzacyjne o dodatkowe œcie¿ki
];

export default AppRoutes; // Eksportuje zdefiniowane trasy jako domyœlny eksport modu³u

