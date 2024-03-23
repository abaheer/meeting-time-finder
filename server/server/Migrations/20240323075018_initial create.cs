using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class initialcreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AvailableTime",
                columns: table => new
                {
                    AvailableTimeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Time = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AvailableTime", x => x.AvailableTimeId);
                });

            migrationBuilder.CreateTable(
                name: "Rooms",
                columns: table => new
                {
                    RoomId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoomName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MeetingStart = table.Column<DateTime>(type: "datetime2", nullable: true),
                    MeetingEnd = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TimeInterval = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rooms", x => x.RoomId);
                });

            migrationBuilder.CreateTable(
                name: "Participants",
                columns: table => new
                {
                    PersonId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RoomId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Participants", x => x.PersonId);
                    table.ForeignKey(
                        name: "FK_Participants_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "RoomId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AvailableTimePerson",
                columns: table => new
                {
                    PersonAvailableTimesAvailableTimeId = table.Column<int>(type: "int", nullable: false),
                    PersonAvailableTimesPersonId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AvailableTimePerson", x => new { x.PersonAvailableTimesAvailableTimeId, x.PersonAvailableTimesPersonId });
                    table.ForeignKey(
                        name: "FK_AvailableTimePerson_AvailableTime_PersonAvailableTimesAvailableTimeId",
                        column: x => x.PersonAvailableTimesAvailableTimeId,
                        principalTable: "AvailableTime",
                        principalColumn: "AvailableTimeId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AvailableTimePerson_Participants_PersonAvailableTimesPersonId",
                        column: x => x.PersonAvailableTimesPersonId,
                        principalTable: "Participants",
                        principalColumn: "PersonId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AvailableTimePerson_PersonAvailableTimesPersonId",
                table: "AvailableTimePerson",
                column: "PersonAvailableTimesPersonId");

            migrationBuilder.CreateIndex(
                name: "IX_Participants_RoomId",
                table: "Participants",
                column: "RoomId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AvailableTimePerson");

            migrationBuilder.DropTable(
                name: "AvailableTime");

            migrationBuilder.DropTable(
                name: "Participants");

            migrationBuilder.DropTable(
                name: "Rooms");
        }
    }
}
