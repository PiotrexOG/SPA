import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Contact = () => {
    const [contacts, setContacts] = useState([]);
    const [newContact, setNewContact] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        category: '1',
        subcategory: '',
        phone: '',
        dateOfBirth: ''
    });
    const [editingContact, setEditingContact] = useState(null);
    const [detailedContact, setDetailedContact] = useState(null);
    const [showSubcategory, setShowSubcategory] = useState(true); // Nowy state do kontroli widoczności pola subkategorii

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await axios.get('/api/Contacts');
            setContacts(response.data); // Ustawienie stanu kontaktów otrzymanymi danymi z API

        } catch (error) {
            console.error("There was an error fetching the contacts!", error);
        }
    };

    const handleAddContact = async () => {
        try {
            await axios.post('/api/Contacts', {
                ...newContact,
                category: parseInt(newContact.category) // Konwertuj kategorię na liczbę całkowitą przed wysłaniem
            });
            setNewContact({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                category: '1',
                subcategory: '',
                phone: '',
                dateOfBirth: ''
            }); // Zresetowanie formularza po dodaniu nowego kontaktu

            fetchContacts();
        } catch (error) {
            console.error("There was an error adding the contact!", error);
        }
    };

    const handleDeleteContact = async (id) => {
        try {
            await axios.delete(`/api/Contacts/${id}`);
            fetchContacts(); // Odświeżenie listy kontaktów po usunięciu kontaktu
        } catch (error) {
            console.error("There was an error deleting the contact!", error);
        }
    };

    const handleUpdateContact = async (id) => {
        try {
            // Konwertuj wartość pola "category" na liczbę całkowitą przed wysłaniem żądania PUT
            editingContact.category = parseInt(editingContact.category);

            await axios.put(`/api/Contacts/${id}`, editingContact);
            setEditingContact(null); // Zresetowanie edytowanego kontaktu po zapisaniu zmian
            fetchContacts();
        } catch (error) {
            console.error("There was an error updating the contact!", error);
        }
    };

    const handleEditContact = (contact) => {
        // Konwertuj kategorię z enum na liczbę całkowitą do edycji
        setEditingContact({
            ...contact,
            category: contact.category.toString(),
            dateOfBirth: new Date(contact.dateOfBirth).toISOString().split('T')[0] // Konwersja daty urodzenia do formatu yyyy-mm-dd

        });
    };

    const handleViewDetails = async (id) => {
        try {
            const response = await axios.get(`/api/Contacts/${id}`);
            // Konwertuj kategorię z liczby całkowitej na enum do wyświetlania szczegółów
            response.data.category = parseInt(response.data.category);
            setDetailedContact(response.data); // Ustawienie stanu szczegółowego kontaktu otrzymanymi danymi z API
        } catch (error) {
            console.error("There was an error fetching the contact details!", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "category") {
            if (value === "1") { // Jeśli wybrano kategorię "Business"
                setShowSubcategory(true);
                setNewContact({ ...newContact, [name]: value, subcategory: 'Szef' }); // Ustaw predefiniowaną subkategorię "Szef"
            } else if (value === "3") { // Jeśli wybrano kategorię "Other"
                setShowSubcategory(true);
                setNewContact({ ...newContact, [name]: value, subcategory: '' }); // Resetowanie subkategorii
            } else { // Dla innych kategorii
                setShowSubcategory(false);
                setNewContact({ ...newContact, [name]: value, subcategory: '' }); // Ukryj subkategorię i zresetuj wartość
            }
        } else {
            setNewContact({ ...newContact, [name]: value }); // Ustawienie stanu nowego kontaktu dla pozostałych pól

        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        if (name === "category") {
            if (value === "1") { // Jeśli wybrano kategorię "Business"
                setShowSubcategory(true);
                setEditingContact({ ...editingContact, [name]: value, subcategory: 'Szef' }); // Ustaw predefiniowaną subkategorię "Szef"
            } else if (value === "3") { // Jeśli wybrano kategorię "Other"
                setShowSubcategory(true);
                setEditingContact({ ...editingContact, [name]: value, subcategory: '' }); // Resetowanie subkategorii
            } else { // Dla innych kategorii
                setShowSubcategory(false);
                setEditingContact({ ...editingContact, [name]: value, subcategory: '' }); // Ukryj subkategorię i zresetuj wartość
            }
        } else {
            setEditingContact({ ...editingContact, [name]: value }); // Ustawienie stanu edytowanego kontaktu dla pozostałych pól

        }
    };

    // Funkcja do mapowania enum na string
    const mapCategoryToString = (category) => {
        switch (category) {
            case 1:
                return "Business";
            case 2:
                return "Private";
            case 3:
                return "Other";
            default:
                return "Unknown"; // Domyślna wartość, jeśli kategoria jest nieznana

        }
    };

    return (
        <div>
            <h1>Contacts</h1>
            <div>
                <h2>Add New Contact</h2>
                <input
                    type="text"
                    name="firstName"
                    value={newContact.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                />
                <input
                    type="text"
                    name="lastName"
                    value={newContact.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                />
                <input
                    type="email"
                    name="email"
                    value={newContact.email}
                    onChange={handleChange}
                    placeholder="Email"
                />
                <input
                    type="password"
                    name="password"
                    value={newContact.password}
                    onChange={handleChange}
                    placeholder="Password"
                />
                <select
                    name="category"
                    value={newContact.category}
                    onChange={handleChange}
                >
                    <option value="1">Business</option>
                    <option value="2">Private</option>
                    <option value="3">Other</option>
                </select>
                {showSubcategory && newContact.category === "1" ? ( // Jeśli showSubcategory jest true i wybrano kategorię "Business"
                    <select
                        name="subcategory"
                        value={newContact.subcategory}
                        onChange={handleChange}
                    >
                        <option value="Szef">Szef</option>
                        <option value="Klient">Klient</option>
                        <option value="Dostawca">Dostawca</option>
                    </select>
                ) : (
                    showSubcategory && newContact.category === "3" ? ( // Jeśli showSubcategory jest true i wybrano kategorię "Other"
                        <input
                            type="text"
                            name="subcategory"
                            value={newContact.subcategory}
                            onChange={handleChange}
                            placeholder="Subcategory"
                        />
                    ) : null // Ukryj pole subkategorii dla innych kategorii niż "Business" i "Other"
                )}

                <input
                    type="text"
                    name="phone"
                    value={newContact.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                />
                <input
                    type="date"
                    name="dateOfBirth"
                    value={newContact.dateOfBirth}
                    onChange={handleChange}
                />
                <button onClick={handleAddContact}>Add Contact</button>
            </div>
            <ul>
                {contacts.map(contact => (
                    <li key={contact.id}> 
                        <span>{contact.firstName} {contact.lastName}</span>
                        <span>Category: {mapCategoryToString(contact.category)}</span>
                        <button onClick={() => handleEditContact(contact)}>Edit</button>
                        <button onClick={() => handleDeleteContact(contact.id)}>Delete</button>
                        <button onClick={() => handleViewDetails(contact.id)}>View Details</button>
                    </li>
                ))}
            </ul>
            {editingContact && (
                <div>
                    <h2>Edit Contact</h2>
                    <input
                        type="text"
                        name="firstName"
                        value={editingContact.firstName}
                        onChange={handleEditChange}
                    />
                    <input
                        type="text"
                        name="lastName"
                        value={editingContact.lastName}
                        onChange={handleEditChange}
                    />
                    <input
                        type="email"
                        name="email"
                        value={editingContact.email}
                        onChange={handleEditChange}
                    />
                    <input
                        type="password"
                        name="password"
                        value={editingContact.password}
                        onChange={handleEditChange}
                    />
                    <select
                        name="category"
                        value={editingContact.category}
                        onChange={handleEditChange}
                    >
                        <option value="1">Business</option>
                        <option value="2">Private</option>
                        <option value="3">Other</option>
                    </select>
                    {showSubcategory && editingContact.category === "1" ? ( // Jeśli showSubcategory jest true i wybrano kategorię "Business"
                        <select
                            name="subcategory"
                            value={editingContact.subcategory}
                            onChange={handleEditChange}
                        >
                            <option value="Szef">Szef</option>
                            <option value="Klient">Klient</option>
                            <option value="Dostawca">Dostawca</option>
                        </select>
                    ) : (
                        showSubcategory && editingContact.category === "3" ? ( // Jeśli showSubcategory jest true i wybrano kategorię "Other"
                            <input
                                type="text"
                                name="subcategory"
                                value={editingContact.subcategory}
                                onChange={handleEditChange}
                                placeholder="Subcategory"
                            />
                        ) : null // Ukryj pole subkategorii dla innych kategorii niż "Business" i "Other"
                    )}
                    <input
                        type="text"
                        name="phone"
                        value={editingContact.phone}
                        onChange={handleEditChange}
                    />
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={editingContact.dateOfBirth}
                        onChange={handleEditChange}
                    />
                    <button onClick={() => handleUpdateContact(editingContact.id)}>Save</button>
                </div>
            )}
            {detailedContact && (
                <div>
                    <h2>Contact Details</h2>
                    <p><strong>First Name:</strong> {detailedContact.firstName}</p>
                    <p><strong>Last Name:</strong> {detailedContact.lastName}</p>
                    <p><strong>Email:</strong> {detailedContact.email}</p>
                    <p><strong>Category:</strong> {mapCategoryToString(detailedContact.category)}</p>
                    <p><strong>Subcategory:</strong> {detailedContact.subcategory}</p>
                    <p><strong>Phone:</strong> {detailedContact.phone}</p>
                    <p><strong>Date of Birth:</strong> {new Date(detailedContact.dateOfBirth).toLocaleDateString()}</p>
                </div>
            )}
        </div>
    );
};

export default Contact;
