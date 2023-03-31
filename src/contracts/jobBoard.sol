// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Job Board Smart Contract
contract JobBoard {
    struct JobPosting {
        uint jobId;
        address employer;
        string jobName;
        string jobDescription;
        uint256 salary;
    }
    uint private jobCount = 0;

    mapping(uint => JobPosting) jobs;

    event JobPosted(
        uint jobId,
        address employer,
        string jobName,
        string jobDescription,
        uint salary
    );

    // Function to post a job
    function postJob(
        string memory _jobName,
        string memory _jobDescription,
        uint256 _salary
    ) public {
        // Create a new job
        JobPosting memory job = JobPosting(
            jobCount,
            msg.sender,
            _jobName,
            _jobDescription,
            _salary
        );
        // Store the new job in the mapping
        jobs[jobCount] = job;

        jobCount++;

        // Emit the JobPosted event
        emit JobPosted(
            job.jobId,
            job.employer,
            job.jobName,
            job.jobDescription,
            job.salary
        );
    }

    function getJobposts(
        uint256 _jobId
    ) public view returns (uint, address, string memory, string memory, uint) {
        JobPosting storage job = jobs[_jobId];
        return (
            job.jobId,
            job.employer,
            job.jobName,
            job.jobDescription,
            job.salary
        );
    }

    function removeJobPost(uint _jobId) external {
        require(msg.sender == jobs[_jobId].employer, "not permmited");
        jobs[_jobId] = jobs[jobCount - 1];
        delete jobs[jobCount - 1];
        jobCount--;
    }

    function getJobsLength() public view returns (uint) {
        return (jobCount);
    }
}
