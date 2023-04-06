using MapAudit.DataAccess.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MapAudit.DataAccess.Configuration
{
    public class CompanyConfig : BaseEntityConfig<Company>
    {
        public CompanyConfig() : base("Companies")
        {
        }
        public override void Configure(EntityTypeBuilder<Company> builder)
        {
            builder.HasMany<Carrier>(x => x.Carriers).WithOne(x => x.Company);

            base.Configure(builder);
        }
    }
}
