type OptherOptionsProps = {
  page?: number | undefined;
  pageSize?: number | undefined;
  difficulty?: ProblemControllerFindAllDifficultyEnum | undefined;
  status?: ProblemControllerFindAllStatusEnum;
  search?: string;
  tags?: Array<string> | undefined;
};
