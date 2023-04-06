using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MapAudit.DataAccess.Migrations
{
    public partial class EditOrder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AlogritmOrder",
                table: "DeliveryPoints");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "DeliveryPoints");

            migrationBuilder.AlterColumn<int>(
                name: "Weight",
                table: "Orders",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "Volume",
                table: "Orders",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<long>(
                name: "CompanyId",
                table: "Orders",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDestination",
                table: "DeliveryPoints",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsOrigin",
                table: "DeliveryPoints",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CompanyId",
                table: "Orders",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Companies_CompanyId",
                table: "Orders",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Companies_CompanyId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_CompanyId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "IsDestination",
                table: "DeliveryPoints");

            migrationBuilder.DropColumn(
                name: "IsOrigin",
                table: "DeliveryPoints");

            migrationBuilder.AlterColumn<string>(
                name: "Weight",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Volume",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "AlogritmOrder",
                table: "DeliveryPoints",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "DeliveryPoints",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
