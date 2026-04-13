def calculate_priority(severity, waiting_time, age):

    weight1 = 0.5
    weight2 = 0.3
    weight3 = 0.2

    priority_score = (
        severity * weight1
        + waiting_time * weight2
        + age * weight3
    )

    return priority_score