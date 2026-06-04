import dynamicDataService from "./dynamicDataService";
import { academicDataDownload, pastPapersData, toolsData, portfolioData } from "../utils/data";

class HybridDataService {

    // Get Past Papers from static data instead of Firebase
    async getPastPapersData() {
        try {
            // Return static data from data.js
            return pastPapersData;
        } catch (error) {
            console.error("Error fetching past papers data:", error);
            return [];
        }
    }

    // Get academic data (outlines and notes) from static data instead of Firebase
    async getAcademicData() {
        try {
            // Return static data from data.js
            return academicDataDownload;
        } catch (error) {
            console.error("Error fetching academic data:", error);
            return [];
        }
    }

    // Get Tools from static data instead of Firebase
    async getToolsData() {
        try {
            // Return static data from data.js
            return toolsData;
        } catch (error) {
            console.error("Error fetching tools data:", error);
            return [];
        }
    }

    // Get Portfolios from static data instead of Firebase
    async getPortfolioData() {
        try {
            // Return static data from data.js
            return portfolioData;
        } catch (error) {
            console.error("Error fetching portfolio data:", error);
            return [];
        }
    }

    // Group academic data by year (for outlines/notes pages)
    async getYearsDownload() {
        const academicData = await this.getAcademicData();
        
        return academicData
            .reduce((acc, item) => {
                const yearIndex = item.year - 1;
                if (!acc[yearIndex]) {
                    acc[yearIndex] = { year: item.year, semesters: [] };
                }
                acc[yearIndex].semesters.push(item);
                return acc;
            }, [])
            .filter((item) => item !== null);
    }
}

const hybridDataService = new HybridDataService();
export default hybridDataService;
