"""
Gram Sahayak (Village Assistant) - Enhanced with Web Search
"""
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from typing import Dict, Any, Optional, List
from datetime import datetime
import requests
from dataclasses import dataclass

# Load environment variables
load_dotenv()

class WebSearcher:
    """
    Simple web search functionality for scheme information
    """
    def __init__(self):
        # You can integrate with Google Custom Search API, Bing API, or SerpAPI
        self.search_api_key = os.getenv("SEARCH_API_KEY")  # Optional
        
    def search_scheme_info(self, scheme_name: str) -> Dict[str, str]:
        """
        Search for current scheme information
        """
        # Predefined scheme database (most current as of 2025)
        scheme_database = {
            "PM-KISAN": {
                "official_name": "Pradhan Mantri Kisan Samman Nidhi",
                "link": "https://pmkisan.gov.in/",
                "description": "Direct income support of ₹6000 per year to farmers",
                "documents": "Aadhaar Card, Bank Account, Land Records"
            },
            "PM Awas Yojana": {
                "official_name": "Pradhan Mantri Awas Yojana - Gramin",
                "link": "https://pmaymis.gov.in/",
                "description": "Housing assistance for rural households",
                "documents": "Aadhaar Card, Bank Account, Income Certificate"
            },
            "MGNREGA": {
                "official_name": "Mahatma Gandhi National Rural Employment Guarantee Act",
                "link": "https://nrega.nic.in/",
                "description": "100 days guaranteed employment per household",
                "documents": "Aadhaar Card, Bank Account, Job Card"
            },
            "National Livestock Mission": {
                "official_name": "National Livestock Mission",
                "link": "https://dahd.nic.in/schemes/programmes/national-livestock-mission",
                "description": "Support for livestock development and productivity",
                "documents": "Aadhaar Card, Bank Account, Caste Certificate"
            },
            "PM Fasal Bima": {
                "official_name": "Pradhan Mantri Fasal Bima Yojana",
                "link": "https://pmfby.gov.in/",
                "description": "Crop insurance scheme for farmers",
                "documents": "Aadhaar Card, Bank Account, Land Records, Sowing Certificate"
            },
            "PM Matsya Sampada": {
                "official_name": "Pradhan Mantri Matsya Sampada Yojana",
                "link": "https://pmmsy.dof.gov.in/",
                "description": "Development of fisheries sector",
                "documents": "Aadhaar Card, Bank Account, Fisherman Card"
            },
            "PM-KUSUM": {
                "official_name": "PM Kisan Urja Suraksha evam Utthaan Mahabhiyan",
                "link": "https://pmkusum.mnre.gov.in/",
                "description": "Solar energy solutions for farmers",
                "documents": "Aadhaar Card, Bank Account, Land Records, Electricity Bill"
            },
            "Skill India": {
                "official_name": "Skill India Mission",
                "link": "https://www.skillindia.gov.in/",
                "description": "Skill development and training programs",
                "documents": "Aadhaar Card, Educational Certificates"
            },
            "PM Vishwakarma": {
                "official_name": "PM Vishwakarma Yojana",
                "link": "https://pmvishwakarma.gov.in/",
                "description": "Support for traditional craftsmen and artisans",
                "documents": "Aadhaar Card, Bank Account, Skill Certificate"
            },
            "Ayushman Bharat": {
                "official_name": "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana",
                "link": "https://pmjay.gov.in/",
                "description": "Health insurance coverage up to ₹5 lakhs",
                "documents": "Aadhaar Card, Ration Card, SECC Database"
            }
        }
        
        # Search for matching scheme
        for key, info in scheme_database.items():
            if key.lower() in scheme_name.lower() or scheme_name.lower() in key.lower():
                return info
        
        # If not found in database, return generic government portal
        return {
            "official_name": scheme_name,
            "link": "https://www.india.gov.in/topics/rural",
            "description": "Government scheme information",
            "documents": "Aadhaar Card, Bank Account"
        }

class GramSahayakAgent:
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the Gram Sahayak Agent with enhanced capabilities
        """
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        # Initialize web searcher
        self.searcher = WebSearcher()
        
        # Configure Gemini
        genai.configure(api_key=self.api_key)
        
        # Initialize the model with enhanced system instructions
        self.system_prompt = self._get_enhanced_system_prompt()
        self.model = genai.GenerativeModel(
            model_name="gemini-2.0-flash-exp",
            system_instruction=self.system_prompt
        )
        
        # Generation config
        self.generation_config = genai.types.GenerationConfig(
            candidate_count=1,
            temperature=0.2,  # Lower temperature for more consistent recommendations
            max_output_tokens=4096,
        )
    
    def _get_enhanced_system_prompt(self) -> str:
        """
        Enhanced system prompt with current scheme information
        """
        current_date = datetime.now().strftime("%d %B %Y")
        
        return f"""## ROLE AND GOAL 
You are 'Gram Sahayak' (Village Assistant), a highly knowledgeable AI advisor specializing in Forest Rights Act (FRA) beneficiaries and central government schemes. Your goal is to provide personalized, actionable scheme recommendations that can genuinely improve the lives of rural beneficiaries.

## CONTEXT
- **Current Date:** {current_date}
- **Focus:** FRA claimants (Scheduled Tribes and Other Traditional Forest Dwellers)
- **Expertise:** Central Government schemes, eligibility criteria, application processes

## KEY SCHEMES TO CONSIDER (2025 Focus):
**Agricultural Support:**
- PM-KISAN (₹6000/year direct benefit transfer)
- PM Fasal Bima Yojana (crop insurance)
- PM-KUSUM (solar solutions for farmers)

**Livelihood & Employment:**
- MGNREGA (100 days guaranteed work)
- PM Vishwakarma (traditional artisans)
- National Livestock Mission

**Housing & Infrastructure:**
- PM Awas Yojana - Gramin
- PM Gram Sadak Yojana

**Health & Social Security:**
- Ayushman Bharat (₹5 lakh health coverage)
- National Food Security Act

## ANALYSIS METHODOLOGY:

1. **Profile Synthesis:** 
   - `social_category` + `fra_right_type` = Primary eligibility base
   - `land_use_primary` + `water_access` = Livelihood focus
   - `location` = State-specific schemes availability

2. **Priority Logic:**
   - **HIGH:** Direct individual benefits, immediate eligibility
   - **MEDIUM:** Community benefits, conditional eligibility

3. **Personalization:** Always connect recommendations to specific profile elements

## OUTPUT FORMAT:

### User-Friendly Report (Markdown):
- Use encouraging, empowering language
- Include specific eligibility reasoning
- Provide practical next steps
- Mention common documents needed

### Developer JSON:
```json
{{
  "scheme_analysis": {{
    "high_priority": [
      {{
        "scheme_name": "Official Scheme Name",
        "reasoning": "Specific profile field connections",
        "official_link": "Current official portal",
        "estimated_benefit": "Quantified benefit if available"
      }}
    ],
    "medium_priority": [...],
    "profile_analysis": {{
      "primary_eligibility_factors": ["factor1", "factor2"],
      "main_livelihood_focus": "derived focus area",
      "geographic_advantages": "location-based opportunities"
    }}
  }}
}}


Always provide accurate, current information and focus on schemes where the claimant has genuine eligibility."""

    def analyze_profile_with_search(self, profile_path: str = None, profile_data: Dict = None) -> Dict[str, Any]:
        """
        Enhanced profile analysis with web search integration
        """
        try:
            # Load profile data
            if profile_data:
                claimant_profile = profile_data
            elif profile_path:
                with open(profile_path, 'r', encoding='utf-8') as f:
                    claimant_profile = json.load(f)
            else:
                raise ValueError("Either profile_path or profile_data must be provided")
            
            # Analyze profile for scheme matching
            scheme_suggestions = self._identify_relevant_schemes(claimant_profile)
            
            # Enrich with current scheme information
            enriched_schemes = []
            for scheme in scheme_suggestions:
                scheme_info = self.searcher.search_scheme_info(scheme['name'])
                enriched_schemes.append({
                    **scheme,
                    'official_info': scheme_info
                })
            
            # Create enhanced prompt with current scheme data
            user_prompt = f"""
Please analyze this FRA claimant profile and provide personalized scheme recommendations using the current scheme information provided:

**CLAIMANT PROFILE:**
{json.dumps(claimant_profile, indent=2, ensure_ascii=False)}

**CURRENT SCHEME DATABASE:**
{json.dumps([s['official_info'] for s in enriched_schemes], indent=2, ensure_ascii=False)}

**PRE-IDENTIFIED RELEVANT SCHEMES:**
{json.dumps(scheme_suggestions, indent=2, ensure_ascii=False)}

Generate both outputs as specified:
1. User-friendly Markdown report with encouraging tone
2. Developer JSON with precise reasoning

Focus on schemes where this specific claimant has direct eligibility and quantifiable benefits.
"""
            
            # Generate response
            response = self.model.generate_content(
                user_prompt,
                generation_config=self.generation_config
            )
            
            if not response.text:
                return {"success": False, "error": "No response generated"}
            
            # Parse response
            return self._parse_response(response.text, claimant_profile)
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Error in enhanced analysis: {str(e)}"
            }
    
    def _identify_relevant_schemes(self, profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Pre-identify potentially relevant schemes based on profile
        """
        schemes = []
        
        # Extract key profile elements
        social_category = profile.get('social_category', '')
        fra_right = profile.get('fra_right_type', '')
        land_use = profile.get('land_use_primary', '')
        water_access = profile.get('water_access', '')
        location = profile.get('location', {})
        
        # Agricultural schemes
        if 'agriculture' in land_use.lower():
            schemes.extend([
                {"name": "PM-KISAN", "priority": "high", "reason": "Direct farmer benefit"},
                {"name": "PM Fasal Bima", "priority": "high", "reason": "Crop insurance for farmers"},
                {"name": "PM-KUSUM", "priority": "medium", "reason": "Solar solutions for agriculture"}
            ])
        
        # Employment schemes
        schemes.append({"name": "MGNREGA", "priority": "high", "reason": "Universal rural employment"})
        
        # Housing schemes
        if 'Traditional Forest Dweller' in social_category or 'Scheduled Tribe' in social_category:
            schemes.append({"name": "PM Awas Yojana", "priority": "high", "reason": "Priority for ST/OTFD"})
        
        # Health schemes
        schemes.append({"name": "Ayushman Bharat", "priority": "high", "reason": "Universal health coverage"})
        
        # Forest-based livelihoods
        if 'forest' in land_use.lower() or any('forest' in str(v).lower() for v in profile.get('land_use_distribution', {}).values()):
            schemes.extend([
                {"name": "National Livestock Mission", "priority": "medium", "reason": "Forest-based animal husbandry"},
                {"name": "PM Vishwakarma", "priority": "medium", "reason": "Traditional forest crafts"}
            ])
        
        return schemes
    
    def _parse_response(self, response_text: str, profile: Dict) -> Dict[str, Any]:
        """
        Parse the model response into structured format
        """
        # Extract JSON from response
        json_start = response_text.find('```json')
        json_end = response_text.find('```', json_start + 7)
        
        if json_start != -1 and json_end != -1:
            json_content = response_text[json_start + 7:json_end].strip()
            markdown_content = response_text[:json_start].strip()
            
            try:
                developer_json = json.loads(json_content)
            except json.JSONDecodeError as e:
                developer_json = {"error": f"JSON parse error: {str(e)}", "raw_json": json_content}
        else:
            markdown_content = response_text
            developer_json = {"error": "No JSON block found in response"}
        
        return {
            "success": True,
            "user_report": markdown_content,
            "developer_json": developer_json,
            "raw_response": response_text,
            "claimant_name": profile.get('holder_name', 'Unknown'),
            "processing_timestamp": datetime.now().isoformat(),
            "analysis_metadata": {
                "profile_summary": {
                    "social_category": profile.get('social_category'),
                    "land_use_primary": profile.get('land_use_primary'),
                    "location": profile.get('location', {}).get('district'),
                    "water_access": profile.get('water_access')
                }
            }
        }
    
    def generate_detailed_report(self, profile_path: str = None, profile_data: Dict = None, save_output: bool = True) -> Dict[str, Any]:
        """
        Generate comprehensive analysis with optional file saving
        """
        print("🔍 Starting enhanced profile analysis...")
        
        # Perform analysis
        result = self.analyze_profile_with_search(profile_path, profile_data)
        
        if result["success"]:
            print(f"✅ Analysis completed for: {result['claimant_name']}")
            
            # Save if requested
            if save_output:
                output_dir = "output"
                os.makedirs(output_dir, exist_ok=True)
                
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                claimant_name = result['claimant_name'].replace(' ', '_').lower()
                
                # Save JSON analysis only
                json_file = os.path.join(output_dir, f"scheme_analysis_{claimant_name}_{timestamp}.json")
                with open(json_file, 'w', encoding='utf-8') as f:
                    json.dump(result, f, indent=2, ensure_ascii=False)
                
                print(f"✅ Analysis saved: {json_file}")
        
        return result


def main():
    """
    Main execution function
    """
    print("🏛️ Starting Gram Sahayak (Village Assistant) Enhanced...")
    print("=" * 70)
    
    try:
        # Initialize the enhanced agent
        agent = GramSahayakAgent()
        print("✅ Enhanced Gram Sahayak initialized successfully")
        
        # Check for FRA profile in output directory
        profile_path = "output/fra_profile_output.json"
        
        if not os.path.exists(profile_path):
            print(f"❌ Profile file not found: {profile_path}")
            print("\n🔧 To fix this:")
            print("1. Run the FRA data processor first: python main.py")
            print("2. Ensure fra_profile_output.json is generated in output directory")
            print("3. Then run this Gram Sahayak agent")
            return
        
        print(f"📊 Found profile: {profile_path}")
        
        # Load and display profile summary
        with open(profile_path, 'r', encoding='utf-8') as f:
            profile = json.load(f)
        
        print(f"\n👤 Claimant: {profile.get('holder_name', 'Unknown')}")
        print(f"🏷️  Category: {profile.get('social_category', 'Unknown')}")
        print(f"🌾 Primary Land Use: {profile.get('land_use_primary', 'Unknown')}")
        print(f"📍 Location: {profile.get('location', {}).get('district', 'Unknown')}, {profile.get('location', {}).get('state', 'Unknown')}")
        
        print("\n🔍 Generating personalized scheme recommendations...")
        print("=" * 70)
        
        # Generate comprehensive analysis
        result = agent.generate_detailed_report(profile_path=profile_path, save_output=True)
        
        if result["success"]:
            print("\n📋 USER REPORT")
            print("=" * 70)
            print(result["user_report"])
            
            print("\n\n🔧 DEVELOPER JSON SUMMARY")
            print("=" * 70)
            dev_json = result.get("developer_json", {})
            
            if "scheme_analysis" in dev_json:
                analysis = dev_json["scheme_analysis"]
                
                print(f"📈 High Priority Schemes: {len(analysis.get('high_priority', []))}")
                for scheme in analysis.get('high_priority', []):
                    print(f"   • {scheme.get('scheme_name', 'Unknown')}")
                
                print(f"📊 Medium Priority Schemes: {len(analysis.get('medium_priority', []))}")
                for scheme in analysis.get('medium_priority', []):
                    print(f"   • {scheme.get('scheme_name', 'Unknown')}")
            else:
                print("⚠️  No structured analysis found")
                print(f"Raw developer JSON: {json.dumps(dev_json, indent=2)[:500]}...")
            
            print(f"\n✅ Complete analysis saved in 'output' directory")
            
        else:
            print(f"❌ Analysis failed: {result.get('error')}")
            if 'raw_response' in result:
                print(f"Raw response preview: {result['raw_response'][:300]}...")
    
    except Exception as e:
        print(f"💥 Error: {e}")
        print("\n🔧 Troubleshooting:")
        print("• Check GEMINI_API_KEY in .env file")
        print("• Verify internet connection")
        print("• Ensure fra_profile_output.json exists")
        print("• Install requirements: pip install -r requirements.txt")


if __name__ == "__main__":
    main()