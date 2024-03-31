﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using server.Models;

#nullable disable

namespace server.Migrations
{
    [DbContext(typeof(MeetingDbContext))]
    partial class MeetingDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("server.Models.AvailableTime", b =>
                {
                    b.Property<int>("AvailableTimeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AvailableTimeId"));

                    b.Property<int?>("RoomId")
                        .HasColumnType("int");

                    b.Property<DateTime>("Time")
                        .HasColumnType("datetime2");

                    b.HasKey("AvailableTimeId");

                    b.HasIndex("RoomId");

                    b.ToTable("AvailableTime");
                });

            modelBuilder.Entity("server.Models.Person", b =>
                {
                    b.Property<int>("PersonId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("PersonId"));

                    b.Property<string>("PersonName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("RoomId")
                        .HasColumnType("int");

                    b.HasKey("PersonId");

                    b.HasIndex("RoomId");

                    b.ToTable("Participants");
                });

            modelBuilder.Entity("server.Models.Person_AvailableTime", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int?>("AvailableTimeId")
                        .HasColumnType("int");

                    b.Property<int?>("PersonId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("AvailableTimeId");

                    b.HasIndex("PersonId");

                    b.ToTable("AvailableParticipants");
                });

            modelBuilder.Entity("server.Models.Room", b =>
                {
                    b.Property<int>("RoomId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RoomId"));

                    b.Property<int?>("MeetingEnd")
                        .HasColumnType("int");

                    b.Property<int?>("MeetingStart")
                        .HasColumnType("int");

                    b.Property<string>("Password")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RoomName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("TimeInterval")
                        .HasColumnType("int");

                    b.HasKey("RoomId");

                    b.ToTable("Rooms");
                });

            modelBuilder.Entity("server.Models.AvailableTime", b =>
                {
                    b.HasOne("server.Models.Room", "Room")
                        .WithMany("AvailableTimes")
                        .HasForeignKey("RoomId");

                    b.Navigation("Room");
                });

            modelBuilder.Entity("server.Models.Person", b =>
                {
                    b.HasOne("server.Models.Room", "Room")
                        .WithMany("Participants")
                        .HasForeignKey("RoomId");

                    b.Navigation("Room");
                });

            modelBuilder.Entity("server.Models.Person_AvailableTime", b =>
                {
                    b.HasOne("server.Models.AvailableTime", "AvailableTime")
                        .WithMany("Person_AvailableTimes")
                        .HasForeignKey("AvailableTimeId");

                    b.HasOne("server.Models.Person", "Person")
                        .WithMany("Person_AvailableTimes")
                        .HasForeignKey("PersonId");

                    b.Navigation("AvailableTime");

                    b.Navigation("Person");
                });

            modelBuilder.Entity("server.Models.AvailableTime", b =>
                {
                    b.Navigation("Person_AvailableTimes");
                });

            modelBuilder.Entity("server.Models.Person", b =>
                {
                    b.Navigation("Person_AvailableTimes");
                });

            modelBuilder.Entity("server.Models.Room", b =>
                {
                    b.Navigation("AvailableTimes");

                    b.Navigation("Participants");
                });
#pragma warning restore 612, 618
        }
    }
}
