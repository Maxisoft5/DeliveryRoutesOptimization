using MapAudit.DataAccess.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MapAudit.DataAccess.Configuration
{
    public class DeliveryPathConfig : BaseEntityConfig<DeliveryPath>
    {
        public DeliveryPathConfig() : base("DeliveryPaths")
        {
        }
        public override void Configure(EntityTypeBuilder<DeliveryPath> builder)
        {
            base.Configure(builder);
        }
    }
}
