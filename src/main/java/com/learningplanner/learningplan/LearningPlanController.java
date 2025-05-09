package com.learningplanner.learningplan;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/learning-plans")
@Tag(name = "Learning Plans", description = "Learning plan management APIs")
public class LearningPlanController {

    private final LearningPlanService learningPlanService;

    @Autowired
    public LearningPlanController(LearningPlanService learningPlanService) {
        this.learningPlanService = learningPlanService;
    }

    @GetMapping
    @Operation(summary = "Get all learning plans", description = "Retrieve all learning plans")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved learning plans",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = LearningPlan.class)))
    })
    public ResponseEntity<List<LearningPlan>> getAllLearningPlans() {
        List<LearningPlan> learningPlans = learningPlanService.getAllLearningPlans();
        return new ResponseEntity<>(learningPlans, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a learning plan by ID", description = "Retrieve a specific learning plan by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the learning plan",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = LearningPlan.class))),
            @ApiResponse(responseCode = "404", description = "Learning plan not found")
    })
    public ResponseEntity<LearningPlan> getLearningPlanById(@PathVariable String id) {
        LearningPlan plan = learningPlanService.getLearningPlanById(id);
        return ResponseEntity.ok(plan);
    }

    @PostMapping
    @Operation(summary = "Create a new learning plan", description = "Create a new learning plan with the provided details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Learning plan created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = LearningPlan.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<LearningPlan> createLearningPlan(
            @Parameter(description = "Learning plan details") @Valid @RequestBody LearningPlan learningPlan) {
        LearningPlan createdLearningPlan = learningPlanService.createLearningPlan(learningPlan);
        return new ResponseEntity<>(createdLearningPlan, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a learning plan", description = "Update an existing learning plan with the provided details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Learning plan updated successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = LearningPlan.class))),
            @ApiResponse(responseCode = "404", description = "Learning plan not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<LearningPlan> updateLearningPlan(@PathVariable String id, @RequestBody LearningPlan learningPlanDetails) {
        LearningPlan updated = learningPlanService.updateLearningPlan(id, learningPlanDetails);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a learning plan", description = "Delete a learning plan by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Learning plan deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Learning plan not found")
    })
    public ResponseEntity<Void> deleteLearningPlan(@PathVariable String id) {
        learningPlanService.deleteLearningPlan(id);
        return ResponseEntity.noContent().build();
    }
}
