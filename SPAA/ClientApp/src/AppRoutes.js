import ApiAuthorzationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { Home } from "./components/Home";
import Contacts from './Contacts';

const AppRoutes = [
    {
        index: true,
        element: <Home /> // Ustawia komponent Home jako domy�ln� stron� g��wn� (index)
    },
    {
        path: '/contacts',
        element: <Contacts /> // Definiuje tras� "/contacts", kt�ra renderuje komponent Contacts
    },
    ...ApiAuthorzationRoutes // Rozszerza istniej�ce trasy autoryzacyjne o dodatkowe �cie�ki
];

export default AppRoutes; // Eksportuje zdefiniowane trasy jako domy�lny eksport modu�u

