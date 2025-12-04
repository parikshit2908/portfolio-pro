import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../supabase/config";

export default function ImageUploader({ onUploaded }) {
  const [loading, setLoading] = useState(false);

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const ext = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${ext}`;

    const { error } = await supabase.storage
      .from("template_files")
      .upload(`assets/${fileName}`, file);

    if (!error) {
      const { data } = supabase.storage
        .from("template_files")
        .getPublicUrl(`assets/${fileName}`);
      onUploaded(data.publicUrl);
    }

    setLoading(false);
  };

  return (
    <div className="img-upload">
      <input type="file" accept="image/*" onChange={uploadFile} />
      {loading && <span>Uploading...</span>}
    </div>
  );
}
