using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MapAudit.DataAccess.Migrations
{
    public partial class EditCarrier : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AverageSpeedPerKmInTown",
                table: "Carriers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AverageSpeedPerKmInTown",
                table: "Carriers");
        }
    }
}
