using MapAudit.DataAccess.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MapAudit.DataAccess.Configuration
{
    public class CarrierConfig : BaseEntityConfig<Carrier>
    {
        public CarrierConfig() : base("Carriers")
        {
        }
        public override void Configure(EntityTypeBuilder<Carrier> builder)
        {
            builder.HasMany(x => x.Orders).WithOne(x => x.Carrier);
            base.Configure(builder);
        }
    }
}
