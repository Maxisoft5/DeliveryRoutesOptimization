using MapAudit.DataAccess.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MapAudit.DataAccess.Configuration
{
    public class DeliveryPointConfig : BaseEntityConfig<DeliveryPoint>
    {
        public DeliveryPointConfig() : base("DeliveryPoints")
        {
        }
        public override void Configure(EntityTypeBuilder<DeliveryPoint> builder)
        {
            base.Configure(builder);
        }
    }
}
