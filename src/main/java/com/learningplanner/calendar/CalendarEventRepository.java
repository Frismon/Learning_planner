package com.learningplanner.calendar;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CalendarEventRepository extends MongoRepository<CalendarEvent, String> {
    List<CalendarEvent> findByUserAndStartTimeBetween(String userId, LocalDateTime start, LocalDateTime end);
    List<CalendarEvent> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);
}
