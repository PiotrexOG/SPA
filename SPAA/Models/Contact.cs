using System;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text.RegularExpressions;

namespace SPAA.Models
{
    public class Contact
    {
        public int Id { get; set; } // Identyfikator kontaktu

        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; } // Imię kontaktu

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; } // Nazwisko kontaktu

        [Required]
        public string Email { get; set; } // Adres e-mail kontaktu

        private string _password;

        [Required]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
        [MaxLength(100)]
        public string Password
        {
            get => _password;
            set
            {
                if (!IsValidPassword(value))
                    throw new ArgumentException("Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.");
                _password = value;
            }
        } // Hasło kontaktu

        [Required]
        public ContactCategory Category { get; set; } // Kategoria kontaktu: Biznesowa, Prywatna, Inna

        public string Subcategory { get; set; } // Podkategoria kontaktu

        [Phone]
        public string Phone { get; set; } // Numer telefonu kontaktu

        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; } // Data urodzenia kontaktu

        private bool IsValidPassword(string password)
        {
            // Basic complexity: at least one upper case, one lower case, one digit, and one special character
            var regex = new Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$");
            return regex.IsMatch(password);
        } // Metoda sprawdzająca poprawność hasła
    }

    public enum ContactCategory
    {
        Business = 1,
        Private = 2,
        Other = 3
    } // Enumeracja kategorii kontaktu
}
