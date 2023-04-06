using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MapAudit.DataAccess.Migrations
{
    public partial class NameUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Companies",
                table: "Companies");

            migrationBuilder.RenameTable(
                name: "Companies",
                newName: "SavedPathes");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SavedPathes",
                table: "SavedPathes",
                column: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_SavedPathes",
                table: "SavedPathes");

            migrationBuilder.RenameTable(
                name: "SavedPathes",
                newName: "Companies");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Companies",
                table: "Companies",
                column: "Id");
        }
    }
}
