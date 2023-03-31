import React from "react";
import { Card, Badge, Col, Stack, Row } from "react-bootstrap";

export const Jobs = (props) => {
  return (
    <Row xs={1} md={3} className="g-4">
      {props.jobs.map((job) => (
        <Col key={job.index}>
          <Card className="h-100">
            <Card.Header>
              <Stack direction="horizontal" gap={2}>
                <Badge bg="secondary" className="ms-auto">
                  {job.index} ID
                </Badge>

                <Badge bg="secondary" className="ms-auto">
                  {job.salary}cUSD/year
                </Badge>
              </Stack>
            </Card.Header>
            <Card.Body className="d-flex  flex-column text-center">
            <Card.Title className="flex-grow-1">
                {job.jobName}
              </Card.Title>
              <Card.Text className="flex-grow-1">
                {job.jobDescription}
              </Card.Text>

         
                {props.walletAddress === job.employer &&(
                  <button
                    type="button"
                    onClick={() => props.removeJob(job.index)}
                    class="btn btn-dark mt-1"
                  >
                    Remove Job
                  </button>
                  )}
            
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
