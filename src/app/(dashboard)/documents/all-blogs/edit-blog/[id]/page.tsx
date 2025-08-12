import React from 'react'
import EditBlogHeader from '../_components/edit-blog-header'
import EditBlogForm from '../_components/edit-blog-form'

const EditBlogPage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <EditBlogHeader blogId={params.id}/>
      <EditBlogForm blogId={params.id}/>
    </div>
  )
}

export default EditBlogPage
