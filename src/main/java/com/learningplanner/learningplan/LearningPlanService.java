package com.learningplanner.learningplan;

import com.learningplanner.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LearningPlanService {

    private final LearningPlanRepository learningPlanRepository;

    @Autowired
    public LearningPlanService(LearningPlanRepository learningPlanRepository) {
        this.learningPlanRepository = learningPlanRepository;
    }

    public List<LearningPlan> getAllLearningPlans() {
        return learningPlanRepository.findAll();
    }

    public LearningPlan getLearningPlanById(String id) {
        return learningPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning plan not found with id: " + id));
    }

    public LearningPlan createLearningPlan(LearningPlan learningPlan) {
        return learningPlanRepository.save(learningPlan);
    }

    public LearningPlan updateLearningPlan(String id, LearningPlan learningPlanDetails) {
        LearningPlan learningPlan = getLearningPlanById(id);
        
        if (learningPlanDetails.getTitle() != null) {
            learningPlan.setTitle(learningPlanDetails.getTitle());
        }
        if (learningPlanDetails.getDescription() != null) {
            learningPlan.setDescription(learningPlanDetails.getDescription());
        }
        if (learningPlanDetails.getStartDate() != null) {
            learningPlan.setStartDate(learningPlanDetails.getStartDate());
        }
        if (learningPlanDetails.getEndDate() != null) {
            learningPlan.setEndDate(learningPlanDetails.getEndDate());
        }
        if (learningPlanDetails.getStatus() != null) {
            learningPlan.setStatus(learningPlanDetails.getStatus());
        }
        return learningPlanRepository.save(learningPlan);
    }

    public void deleteLearningPlan(String id) {
        LearningPlan learningPlan = getLearningPlanById(id);
        learningPlanRepository.delete(learningPlan);
    }
}
