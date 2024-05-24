using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SPAA.Data;
using SPAA.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SPAA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ContactsController(ApplicationDbContext context)
        {
            _context = context; // Wstrzykiwanie kontekstu bazy danych przez konstruktor
        }

        // GET: api/Contacts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContacts()
        {
            var contacts = await _context.Contacts.ToListAsync();
            contacts.ForEach(c => c.Category = (ContactCategory)(int)c.Category); // Konwersja kategorii na enum w odpowiedzi
            return contacts; // Zwrócenie listy kontaktów
        }

        // GET: api/Contacts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Contact>> GetContact(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);

            if (contact == null)
            {
                return NotFound(); // Zwrócenie NotFound, jeśli kontakt nie istnieje
            }

            // Konwersja kategorii z enum na int w odpowiedzi
            contact.Category = (ContactCategory)(int)contact.Category;

            return contact; // Zwrócenie kontaktu
        }

        [Authorize]
        // PUT: api/Contacts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContact(int id, Contact contact)
        {
            if (id != contact.Id)
            {
                return BadRequest(); // Zwrócenie BadRequest, jeśli id nie pasuje do kontaktu
            }

            // Konwersja kategorii z int na enum
            contact.Category = (ContactCategory)contact.Category;

            _context.Entry(contact).State = EntityState.Modified; // Ustawienie stanu kontaktu na zmodyfikowany

            try
            {
                await _context.SaveChangesAsync(); // Zapisanie zmian w bazie danych
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContactExists(id))
                {
                    return NotFound(); // Zwrócenie NotFound, jeśli kontakt nie istnieje
                }
                else
                {
                    throw;
                }
            }

            return NoContent(); // Zwrócenie NoContent po pomyślnym zaktualizowaniu kontaktu
        }

        [Authorize]
        // POST: api/Contacts
        [HttpPost]
        public async Task<ActionResult<Contact>> PostContact(Contact contact)
        {
            contact.Category = (ContactCategory)contact.Category; // Konwersja z int na enum
            _context.Contacts.Add(contact); // Dodanie kontaktu do kontekstu
            await _context.SaveChangesAsync(); // Zapisanie zmian w bazie danych

            return CreatedAtAction("GetContact", new { id = contact.Id }, contact); // Zwrócenie CreatedAtAction z nowym kontaktem
        }

        [Authorize]
        // DELETE: api/Contacts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null)
            {
                return NotFound(); // Zwrócenie NotFound, jeśli kontakt nie istnieje
            }

            _context.Contacts.Remove(contact); // Usunięcie kontaktu z kontekstu
            await _context.SaveChangesAsync(); // Zapisanie zmian w bazie danych

            return NoContent(); // Zwrócenie NoContent po pomyślnym usunięciu kontaktu
        }

        private bool ContactExists(int id)
        {
            return _context.Contacts.Any(e => e.Id == id); // Sprawdzenie, czy kontakt istnieje w bazie danych
        }
    }
}
