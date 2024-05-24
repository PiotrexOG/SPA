using Duende.IdentityServer.EntityFramework.Entities;
using Duende.IdentityServer.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SPAA.Models;

namespace SPAA.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions options, IOptions<OperationalStoreOptions> operationalStoreOptions)
            : base(options, operationalStoreOptions)
        {
            // Konstruktor klasy ApplicationDbContext, dziedziczącej po ApiAuthorizationDbContext<ApplicationUser>
        }

        public DbSet<Contact> Contacts { get; set; } // Zbiór DbSet dla modelu Contact, reprezentujący tabelę "Contacts" w bazie danych
    }
}
