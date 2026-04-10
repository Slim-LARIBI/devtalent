export type MatchingInput = {
  expert: {
    expertise: string[];
    donorExperience: string[];
    languages: string[];
    level: string;
    location: string;
  };
  mission: {
    expertise: string[];
    donor: string | null;
    languages: string[];
    seniority: string | null;
    country: string | null;
  };
};

export type MatchingResult = {
  score: number;
  reasons: string[];
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function uniqueNormalized(values: string[]) {
  return Array.from(new Set(values.map(normalize).filter(Boolean)));
}

function intersection(a: string[], b: string[]) {
  const bSet = new Set(b);
  return a.filter((item) => bSet.has(item));
}

const LEVEL_RANK: Record<string, number> = {
  JUNIOR: 1,
  MID: 2,
  SENIOR: 3,
  PRINCIPAL: 4,
  DIRECTOR: 5,
};

function computeExpertiseScore(expertExpertise: string[], missionExpertise: string[]) {
  if (missionExpertise.length === 0) return 1;

  const matches = intersection(
    uniqueNormalized(expertExpertise),
    uniqueNormalized(missionExpertise)
  );

  return matches.length / missionExpertise.length;
}

function computeDonorScore(expertDonors: string[], missionDonor: string | null) {
  if (!missionDonor) return 1;

  const donors = uniqueNormalized(expertDonors);
  return donors.includes(normalize(missionDonor)) ? 1 : 0;
}

function computeLanguageScore(expertLanguages: string[], missionLanguages: string[]) {
  if (missionLanguages.length === 0) return 1;

  const matches = intersection(
    uniqueNormalized(expertLanguages),
    uniqueNormalized(missionLanguages)
  );

  return matches.length / missionLanguages.length;
}

function computeLevelScore(expertLevel: string, missionSeniority: string | null) {
  if (!missionSeniority) return 1;

  const expertRank = LEVEL_RANK[expertLevel] ?? 2;
  const missionRank = LEVEL_RANK[missionSeniority] ?? 2;

  if (expertRank >= missionRank) return 1;
  if (expertRank === missionRank - 1) return 0.6;
  return 0.2;
}

function computeLocationScore(expertLocation: string, missionCountry: string | null) {
  if (!missionCountry) return 1;

  const location = normalize(expertLocation);
  const country = normalize(missionCountry);

  if (!location) return 0.2;
  if (location.includes(country)) return 1;
  return 0.3;
}

export function computeMatchScore({ expert, mission }: MatchingInput): number {
  const expertiseScore = computeExpertiseScore(expert.expertise, mission.expertise);   // 35
  const donorScore = computeDonorScore(expert.donorExperience, mission.donor);        // 20
  const levelScore = computeLevelScore(expert.level, mission.seniority);              // 20
  const locationScore = computeLocationScore(expert.location, mission.country);        // 15
  const languageScore = computeLanguageScore(expert.languages, mission.languages);     // 10

  let finalScore =
    expertiseScore * 35 +
    donorScore * 20 +
    levelScore * 20 +
    locationScore * 15 +
    languageScore * 10;

  if (expertiseScore === 0) {
    finalScore *= 0.5;
  }

  return Math.max(0, Math.min(100, Math.round(finalScore)));
}

export function computeMatchWithDetails({ expert, mission }: MatchingInput): MatchingResult {
  const normalizedExpertise = uniqueNormalized(expert.expertise);
  const normalizedMissionExpertise = uniqueNormalized(mission.expertise);

  const normalizedExpertDonors = uniqueNormalized(expert.donorExperience);
  const normalizedExpertLanguages = uniqueNormalized(expert.languages);
  const normalizedMissionLanguages = uniqueNormalized(mission.languages);

  const expertiseMatches = intersection(normalizedExpertise, normalizedMissionExpertise);
  const languageMatches = intersection(normalizedExpertLanguages, normalizedMissionLanguages);

  const expertiseScore = computeExpertiseScore(expert.expertise, mission.expertise);
  const donorScore = computeDonorScore(expert.donorExperience, mission.donor);
  const levelScore = computeLevelScore(expert.level, mission.seniority);
  const locationScore = computeLocationScore(expert.location, mission.country);
  const languageScore = computeLanguageScore(expert.languages, mission.languages);

  let score =
    expertiseScore * 35 +
    donorScore * 20 +
    levelScore * 20 +
    locationScore * 15 +
    languageScore * 10;

  if (expertiseScore === 0) {
    score *= 0.5;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  const reasons: string[] = [];

  if (normalizedMissionExpertise.length > 0) {
    reasons.push(
      `Matches ${expertiseMatches.length}/${normalizedMissionExpertise.length} required skills`
    );
  }

  if (
    mission.donor &&
    normalizedExpertDonors.includes(normalize(mission.donor))
  ) {
    reasons.push(`${mission.donor} donor experience`);
  }

  const expertRank = LEVEL_RANK[expert.level] ?? 2;
  const missionRank = LEVEL_RANK[mission.seniority || "MID"] ?? 2;

  if (expertRank >= missionRank) {
    reasons.push("Seniority aligned");
  }

  if (
    mission.country &&
    normalize(expert.location).includes(normalize(mission.country))
  ) {
    reasons.push(`Based in ${mission.country}`);
  }

  if (languageMatches.length > 0) {
    const displayLanguages = mission.languages.filter((lang) =>
      languageMatches.includes(normalize(lang))
    );
    reasons.push(`Speaks ${displayLanguages.join(", ")}`);
  }

  return {
    score,
    reasons,
  };
}