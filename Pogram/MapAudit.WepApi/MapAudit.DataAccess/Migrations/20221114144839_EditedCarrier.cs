using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MapAudit.DataAccess.Migrations
{
    public partial class EditedCarrier : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "DeliveryPoints",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "FuelConsumptionInLitersInTownPer100Km",
                table: "Carriers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TruckType",
                table: "Carriers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FuelConsumptionInLitersInTownPer100Km",
                table: "Carriers");

            migrationBuilder.DropColumn(
                name: "TruckType",
                table: "Carriers");

            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "DeliveryPoints",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
