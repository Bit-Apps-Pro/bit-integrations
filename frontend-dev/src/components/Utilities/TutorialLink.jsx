import DocIcn from '../../Icons/DocIcn'
import YoutubeIcn from '../../Icons/YoutubeIcn'

export default function TutorialLink({ title, subtitle, youTubeLink, docLink, style }) {
  return (
    <div style={style}>
      <span className={`tutoriallink p-1 ${youTubeLink && 'youtube'}`}>
        {youTubeLink ? <YoutubeIcn size="25" className="mr-1" /> : <DocIcn size="18" className="mr-1" />}
        <a target="_blank" rel="noreferrer" href={youTubeLink || docLink}>{title}</a>
      </span>
      {subtitle && (
        <p className="mt-1">{subtitle}</p>
      )}
    </div>
  )
}
