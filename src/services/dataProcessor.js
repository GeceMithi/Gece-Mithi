// Data processor to convert Firebase data into box and card structure

export const processAcademicData = (data, type) => {
    console.log(`🔄 Processing ${type} data:`, data);
    
    if (!data || !Array.isArray(data)) {
        console.warn(`❌ Invalid data for ${type}:`, data);
        return [];
    }

    if (data.length === 0) {
        console.log(`ℹ️ Empty data array for ${type}`);
        return [];
    }

    // Group data by year
    const yearGroups = {};
    
    data.forEach((item, index) => {
        console.log(`📝 Processing item ${index}:`, item);
        
        const year = item.year;
        const semester = item.semester;
        
        if (!year || !semester) {
            console.warn(`⚠️ Item missing year or semester:`, item);
            return; // Skip this item
        }
        
        if (!yearGroups[year]) {
            yearGroups[year] = {
                year: year,
                semesters: {}
            };
            console.log(`📁 Created year group for Year ${year}`);
        }
        
        if (!yearGroups[year].semesters[semester]) {
            yearGroups[year].semesters[semester] = {
                semester: semester,
                courses: []
            };
            console.log(`📂 Created semester group for Year ${year}, Semester ${semester}`);
        }
        
        // Add course to semester
        const courseData = {
            subject: item.subject,
            courseCode: item.courseCode || '',
            link: item.link,
            year: item.year,
            semester: item.semester
        };
        
        yearGroups[year].semesters[semester].courses.push(courseData);
        console.log(`➕ Added course: ${item.subject} (Link: ${item.link ? 'Yes' : 'No'})`);
    });

    // Convert to array format and sort
    const result = Object.keys(yearGroups)
        .map(year => ({
            year: parseInt(year),
            semesters: Object.keys(yearGroups[year].semesters)
                .map(semester => yearGroups[year].semesters[semester])
                .sort((a, b) => a.semester - b.semester)
        }))
        .sort((a, b) => a.year - b.year);

    console.log(`📊 Processed ${type} data:`, {
        totalYears: result.length,
        totalSemesters: result.reduce((acc, year) => acc + year.semesters.length, 0),
        totalCourses: result.reduce((acc, year) => 
            acc + year.semesters.reduce((semAcc, sem) => semAcc + sem.courses.length, 0), 0
        )
    });

    return result;
};

export const getTypeConfig = (type) => {
    const configs = {
        outline: {
            title: 'Course Outlines (Syllabus)',
            description: 'Access the official course outlines for B.Ed (Hons) subjects across 8 semesters.',
            mainTitle: 'Course Outlines',
            buttonText: 'Download Outline'
        },
        notes: {
            title: 'Academic Notes',
            description: 'Access lecture notes and supporting material for B.Ed (Hons) subjects across 8 semesters.',
            mainTitle: 'Academic Notes',
            buttonText: 'Download Notes'
        },
        past_paper: {
            title: 'Past Papers',
            description: 'Access previous exam papers and assessments for B.Ed (Hons) subjects across 8 semesters.',
            mainTitle: 'Past Papers',
            buttonText: 'Download Past Paper'
        }
    };

    return configs[type] || configs.outline;
};

export const validateAcademicData = (data) => {
    if (!data) {
        console.warn('⚠️ No data provided');
        return false;
    }

    if (!Array.isArray(data)) {
        console.warn('⚠️ Data is not an array');
        return false;
    }

    if (data.length === 0) {
        console.log('ℹ️ Data array is empty');
        return true; // Empty is valid
    }

    // Validate each item
    const validItems = data.filter(item => {
        return item && 
               typeof item === 'object' &&
               item.year !== undefined &&
               item.semester !== undefined &&
               item.subject;
    });

    if (validItems.length !== data.length) {
        console.warn(`⚠️ ${data.length - validItems.length} invalid items found`);
    }

    return validItems.length > 0;
};
