export type Props = {
  id?: string
};

export type ViewState = {
  view: State,
  model: StageModelState
};

class StageView extends AbstractStageView<AbstractProps & AbstractProps> {
  state: ViewState;
}
