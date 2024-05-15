exports.generateCSV = (students) => {
    const headers = "Roll Number,Full Name,Email,Enrolled Course,Course Code,Course Name,Street,City,State,Country,Zip Code,Date of Birth\n";
    const rows = students.map(student => {
      const enrolledOn = student.enrolledCourse && student.enrolledCourse.enrolledOn ? student.enrolledCourse.enrolledOn.toISOString().split('T')[0] : '';
      const courseCode = student.enrolledCourse ? student.enrolledCourse.courseCode : '';
      const courseName = student.enrolledCourse ? student.enrolledCourse.courseName : '';
      const street = student.address ? student.address.street : '';
      const city = student.address ? student.address.city.replace(/,/g, ';') : ''; // Replace commas to avoid breaking CSV format
      const state = student.address ? student.address.state : '';
      const country = student.address ? student.address.country : '';
      const zipCode = student.address ? student.address.zipCode : '';
      const dob = student.dateOfBirth ? student.dateOfBirth.toISOString().split('T')[0] : '';

      return [
        student.rollNumber,
        student.fullName.replace(/,/g, ';'), // Handle commas in names
        student.email,
        enrolledOn,
        courseCode,
        courseName,
        street,
        city,
        state,
        country,
        zipCode,
        dob
      ].join(',');
    }).join('\n');
    return `${headers}${rows}`;
  };
  