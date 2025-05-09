package com.learningplanner.calendar;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/calendar-events")
@Tag(name = "Calendar Events", description = "Calendar event management APIs")
public class CalendarEventController {

    private final CalendarEventService calendarEventService;

    @Autowired
    public CalendarEventController(CalendarEventService calendarEventService) {
        this.calendarEventService = calendarEventService;
    }

    @GetMapping
    @Operation(summary = "Get all calendar events", description = "Retrieve all calendar events or filter by date range")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved calendar events",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = CalendarEvent.class)))
    })
    public ResponseEntity<List<CalendarEvent>> getAllEvents(
            @Parameter(description = "Start date for filtering") 
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date for filtering") 
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<CalendarEvent> events = calendarEventService.getAllEvents(startDate, endDate);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a calendar event by ID", description = "Retrieve a specific calendar event by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the calendar event",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = CalendarEvent.class))),
            @ApiResponse(responseCode = "404", description = "Calendar event not found")
    })
    public ResponseEntity<CalendarEvent> getEventById(@PathVariable String id) {
        CalendarEvent event = calendarEventService.getEventById(id);
        return ResponseEntity.ok(event);
    }

    @PostMapping
    @Operation(summary = "Create a new calendar event", description = "Create a new calendar event with the provided details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Calendar event created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = CalendarEvent.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<CalendarEvent> createEvent(
            @Parameter(description = "Calendar event details") @Valid @RequestBody CalendarEvent event) {
        CalendarEvent createdEvent = calendarEventService.createEvent(event);
        return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a calendar event", description = "Update an existing calendar event with the provided details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Calendar event updated successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = CalendarEvent.class))),
            @ApiResponse(responseCode = "404", description = "Calendar event not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<CalendarEvent> updateEvent(@PathVariable String id, @RequestBody CalendarEvent eventDetails) {
        CalendarEvent updated = calendarEventService.updateEvent(id, eventDetails);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a calendar event", description = "Delete a calendar event by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Calendar event deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Calendar event not found")
    })
    public ResponseEntity<Void> deleteEvent(@PathVariable String id) {
        calendarEventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}
