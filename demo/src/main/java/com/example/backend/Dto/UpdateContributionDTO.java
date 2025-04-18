package com.example.backend.Dto;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateContributionDTO {
    private String type;
    private Date date;
    private String lieu;
}