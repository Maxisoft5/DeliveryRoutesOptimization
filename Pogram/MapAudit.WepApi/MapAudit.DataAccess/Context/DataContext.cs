using MapAudit.DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace MapAudit.DataAccess.Context
{
    public class DataContext : DbContext
    {
        public DbSet<Carrier> Carriers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<DeliveryPoint> DeliveryPoints { get; set; }
        public DbSet<DeliveryPath> DeliveryPaths { get; set; }
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DeliveryPoint>().HasMany(x => x.DeliveryPathsFrom).WithOne(x => x.From).IsRequired();
            modelBuilder.Entity<DeliveryPoint>().HasMany(x => x.DeliveryPathsTo).WithOne(x => x.To).IsRequired();
            modelBuilder.Entity<DeliveryPath>().HasOne(x => x.Order).WithMany(x => x.DeliveryPaths).IsRequired();
        }

    }
}
