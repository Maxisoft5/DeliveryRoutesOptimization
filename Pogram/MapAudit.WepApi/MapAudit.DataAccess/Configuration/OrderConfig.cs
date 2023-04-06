using MapAudit.DataAccess.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MapAudit.DataAccess.Configuration
{
    public class OrderConfig : BaseEntityConfig<Order>
    {
        public OrderConfig() : base("Orders")
        {
        }
        public override void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.HasMany(x => x.DeliveryPaths).WithOne(x => x.Order);
            base.Configure(builder);
        }
    }
}
