using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class intitialcreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Rooms",
                columns: table => new
                {
                    RoomId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoomName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MeetingStart = table.Column<int>(type: "int", nullable: true),
                    MeetingEnd = table.Column<int>(type: "int", nullable: true),
                    TimeInterval = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rooms", x => x.RoomId);
                });

            migrationBuilder.CreateTable(
                name: "AvailableTime",
                columns: table => new
                {
                    AvailableTimeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Time = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RoomId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AvailableTime", x => x.AvailableTimeId);
                    table.ForeignKey(
                        name: "FK_AvailableTime_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "RoomId");
                });

            migrationBuilder.CreateTable(
                name: "Participants",
                columns: table => new
                {
                    PersonId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PersonName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RoomId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Participants", x => x.PersonId);
                    table.ForeignKey(
                        name: "FK_Participants_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "RoomId");
                });

            migrationBuilder.CreateTable(
                name: "AvailableParticipants",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AvailableTimeId = table.Column<int>(type: "int", nullable: true),
                    PersonId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AvailableParticipants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AvailableParticipants_AvailableTime_AvailableTimeId",
                        column: x => x.AvailableTimeId,
                        principalTable: "AvailableTime",
                        principalColumn: "AvailableTimeId");
                    table.ForeignKey(
                        name: "FK_AvailableParticipants_Participants_PersonId",
                        column: x => x.PersonId,
                        principalTable: "Participants",
                        principalColumn: "PersonId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AvailableParticipants_AvailableTimeId",
                table: "AvailableParticipants",
                column: "AvailableTimeId");

            migrationBuilder.CreateIndex(
                name: "IX_AvailableParticipants_PersonId",
                table: "AvailableParticipants",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_AvailableTime_RoomId",
                table: "AvailableTime",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Participants_RoomId",
                table: "Participants",
                column: "RoomId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AvailableParticipants");

            migrationBuilder.DropTable(
                name: "AvailableTime");

            migrationBuilder.DropTable(
                name: "Participants");

            migrationBuilder.DropTable(
                name: "Rooms");
        }
    }
}
