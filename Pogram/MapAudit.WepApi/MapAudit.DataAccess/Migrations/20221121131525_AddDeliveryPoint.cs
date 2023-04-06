using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MapAudit.DataAccess.Migrations
{
    public partial class AddDeliveryPoint : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DeliveryPaths",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FromId = table.Column<long>(type: "bigint", nullable: false),
                    ToId = table.Column<long>(type: "bigint", nullable: false),
                    Distance = table.Column<double>(type: "float", nullable: false),
                    Hours = table.Column<double>(type: "float", nullable: false),
                    OrderId = table.Column<long>(type: "bigint", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDelete = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeliveryPaths", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DeliveryPaths_DeliveryPoints_FromId",
                        column: x => x.FromId,
                        principalTable: "DeliveryPoints",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_DeliveryPaths_DeliveryPoints_ToId",
                        column: x => x.ToId,
                        principalTable: "DeliveryPoints",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_DeliveryPaths_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DeliveryPaths_FromId",
                table: "DeliveryPaths",
                column: "FromId");

            migrationBuilder.CreateIndex(
                name: "IX_DeliveryPaths_OrderId",
                table: "DeliveryPaths",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_DeliveryPaths_ToId",
                table: "DeliveryPaths",
                column: "ToId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DeliveryPaths");
        }
    }
}
