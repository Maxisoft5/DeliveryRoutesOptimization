using System.ComponentModel.DataAnnotations;

namespace MapAudit.DataAccess.Models
{
    public abstract class BaseEntity
    {
        [Key]
        public virtual long Id { get; set; }
        public virtual DateTime CreationDate { get; set; }
        public bool IsDelete { get; set; }
    }

}
