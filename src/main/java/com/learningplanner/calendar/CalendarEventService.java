package com.learningplanner.calendar;

import com.learningplanner.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CalendarEventService {

    private final CalendarEventRepository calendarEventRepository;

    @Autowired
    public CalendarEventService(CalendarEventRepository calendarEventRepository) {
        this.calendarEventRepository = calendarEventRepository;
    }

    public List<CalendarEvent> getAllEvents(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate != null && endDate != null) {
            return calendarEventRepository.findByStartTimeBetween(startDate, endDate);
        }
        return calendarEventRepository.findAll();
    }

    public CalendarEvent getEventById(String id) {
        return calendarEventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Calendar event not found with id: " + id));
    }

    public CalendarEvent createEvent(CalendarEvent event) {
        return calendarEventRepository.save(event);
    }

    public CalendarEvent updateEvent(String id, CalendarEvent eventDetails) {
        CalendarEvent event = getEventById(id);
        
        if (eventDetails.getTitle() != null) {
            event.setTitle(eventDetails.getTitle());
        }
        if (eventDetails.getDescription() != null) {
            event.setDescription(eventDetails.getDescription());
        }
        if (eventDetails.getCategory() != null) {
            event.setCategory(eventDetails.getCategory());
        }
        if (eventDetails.getStartTime() != null) {
            event.setStartTime(eventDetails.getStartTime());
        }
        if (eventDetails.getEndTime() != null) {
            event.setEndTime(eventDetails.getEndTime());
        }
        return calendarEventRepository.save(event);
    }

    public void deleteEvent(String id) {
        CalendarEvent event = getEventById(id);
        calendarEventRepository.delete(event);
    }
}
